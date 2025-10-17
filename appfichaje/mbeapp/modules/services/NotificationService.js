const nodemailer = require('nodemailer');

const alertCache = new Map();
let transporter;

const isEmailConfigured = () => {
    return Boolean(
        process.env.SMTP_HOST &&
        process.env.SMTP_PORT &&
        process.env.SMTP_USER &&
        process.env.SMTP_PASS
    );
};

const getTransporter = () => {
    if (!isEmailConfigured()) return null;
    if (transporter) return transporter;

    transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: String(process.env.SMTP_SECURE || '').toLowerCase() === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    return transporter;
};

const resolveResponsible = ({ responsibleEmail }) => {
    const fallback = process.env.LATE_ALERT_FALLBACK_RECIPIENT;
    const email = (responsibleEmail && responsibleEmail.trim()) || (fallback && fallback.trim()) || null;

    return {
        email,
        name: process.env.LATE_ALERT_FALLBACK_NAME || 'Responsable RRHH'
    };
};

const formatLateDetails = ({ lateInfo, summaryDetails }) => {
    const chunks = [];
    if (lateInfo && lateInfo.fecha) {
        chunks.push(`Último registro tardío: ${lateInfo.fecha} (${lateInfo.entrada || 'hora no disponible'})`);
    }
    if (lateInfo && typeof lateInfo.lateMinutes === 'number') {
        chunks.push(`Retraso más reciente: ${lateInfo.lateMinutes} minutos`);
    }
    if (Array.isArray(summaryDetails) && summaryDetails.length) {
        const list = summaryDetails
            .map(item => {
                const day = item.fecha || item.date || 'fecha desconocida';
                return `- ${day}`;
            })
            .join('\n');
        chunks.push('Detalle de la semana:\n' + list);
    }
    return chunks.join('\n');
};

const buildEmailContent = ({ userId, weekKey, count, limit, thresholdTime, lateInfo, summaryDetails }) => {
    const subject = `[MBE ERP] Alerta de llegadas tardías (${userId})`;
    const intro = `El usuario ${userId} ha registrado ${count} llegadas tardías esta semana (límite ${limit}).`;
    const thresholdLine = thresholdTime ? `Umbral configurado: ${thresholdTime}.` : '';
    const detail = formatLateDetails({ lateInfo, summaryDetails });
    const lines = [intro, thresholdLine, detail].filter(Boolean).join('\n\n');
    const segments = lines ? lines.split('\n') : ['No se encontraron detalles adicionales.'];

    const htmlLines = segments
        .map(segment => segment.startsWith('- ')
            ? `<li>${segment.substring(2)}</li>`
            : `<p>${segment}</p>`)
        .join('');

    const html = `
        <div>
            <p><strong>Semana:</strong> ${weekKey}</p>
            ${htmlLines}
        </div>
    `;

    return { subject, text: lines, html };
};

const sendEmailIfPossible = async ({ responsible, emailData }) => {
    if (!responsible.email) {
        return { emailQueued: false, reason: 'NO_RECIPIENT' };
    }

    const mailer = getTransporter();
    if (!mailer) {
        return { emailQueued: false, reason: 'SMTP_NOT_CONFIGURED', responsible };
    }

    const from = process.env.LATE_ALERT_FROM || process.env.SMTP_USER;
    const replyTo = process.env.LATE_ALERT_REPLY_TO || undefined;

    const { subject, text, html } = buildEmailContent(emailData);

    const info = await mailer.sendMail({
        from,
        to: responsible.email,
        subject,
        text,
        html,
        replyTo
    });

    return {
        emailQueued: true,
        messageId: info.messageId,
        responsible
    };
};

const handleLateAlert = async ({ userId, weekKey, count, limit, thresholdTime, lateInfo, summaryDetails, responsibleEmail, requestContext }) => {
    const cacheKey = `${userId || 'unknown'}__${weekKey || 'unknown'}`.toLowerCase();
    if (alertCache.has(cacheKey)) {
        return {
            ...alertCache.get(cacheKey),
            deduped: true
        };
    }

    const responsible = resolveResponsible({ responsibleEmail });
    const effectiveLimit = typeof limit === 'number'
        ? limit
        : Number(process.env.LATE_ALERT_WEEKLY_LIMIT) || 3;

    const emailResult = await sendEmailIfPossible({
        responsible,
        emailData: { userId, weekKey, count, limit: effectiveLimit, thresholdTime, lateInfo, summaryDetails }
    });

    const record = {
        userId,
        weekKey,
        count,
        limit: effectiveLimit,
        thresholdTime,
        responsible,
        emailQueued: emailResult.emailQueued,
        messageId: emailResult.messageId || null,
        reason: emailResult.reason || null,
        requestContext: requestContext || null,
        sentAt: emailResult.emailQueued ? new Date().toISOString() : null
    };

    alertCache.set(cacheKey, record);
    return {
        ...record,
        deduped: false
    };
};

module.exports = {
    handleLateAlert,
    isEmailConfigured
};
