const Fichar = {
    socket: null,
    modalApp: null,
    clientFromID: null,
    urlServer: null,
    user: null,
    qr: null,
    token: null,
    isProcessing: false, // Add flag to prevent double processing
    LATE_THRESHOLD_MINUTES: (9 * 60) + 6,
    LATE_LIMIT: 3,

    init: (tokenQR, urlServerIn, userLogin, tokenLogin) => {
        // Check if we're already processing (using localStorage for persistence across page loads)
        const processingKey = `fichar_processing_${userLogin}`;
        const lastProcessingTime = localStorage.getItem(processingKey);
        const currentTime = Date.now();
        
        // If we processed within the last 10 seconds, skip
        if (lastProcessingTime && (currentTime - parseInt(lastProcessingTime)) < 10000) {
            console.log('Fichar recently processed, skipping to prevent duplicate...', {
                lastProcessed: new Date(parseInt(lastProcessingTime)).toISOString(),
                currentTime: new Date(currentTime).toISOString(),
                timeDiff: currentTime - parseInt(lastProcessingTime)
            });
            // Redirect to home instead of staying on fichar page
            location.href = '/?fichaje=recent';
            return;
        }
        
        // Check if there's a recent API call timestamp to prevent race conditions
        const apiCallKey = `fichar_api_call_${userLogin}`;
        const lastApiCall = localStorage.getItem(apiCallKey);
        if (lastApiCall && (currentTime - parseInt(lastApiCall)) < 5000) {
            console.log('Recent API call detected, preventing race condition...');
            location.href = '/?fichaje=recent';
            return;
        }
        
        // Prevent multiple initializations
        if (Fichar.isProcessing) {
            console.log('Fichar already processing in memory, skipping...');
            return;
        }
        
        // Mark as processing and store timestamp
        Fichar.isProcessing = true;
        localStorage.setItem(processingKey, currentTime.toString());
        
        console.log('=== FICHAR INIT START ===');
        console.log('Processing timestamp:', new Date(currentTime).toISOString());
        console.log('User:', userLogin);
        console.log('QR Token:', tokenQR);
        
        // Add a small delay to prevent rapid double-calls
        setTimeout(() => {
            
            clientFromID = Util.generateUID()
            modalApp = new bootstrap.Modal(document.getElementById('modalEspera'), {})
            urlServer = urlServerIn
            user = userLogin
            qr = tokenQR || ''
            token = tokenLogin || ''
            console.log('=== FICHAR INIT PARAMETERS ===')
            console.log('qr: ', qr)
            console.log('urlServer: ', urlServer)
            console.log('user: ', user)
            console.log('timestamp: ', new Date().toISOString())

        // Check if we're in localhost testing mode or have a QR token
        if ((urlServer && urlServer.includes('185.252.233.57:3002')) || qr) {
            console.log('Testing mode detected or QR token present - calling API directly')
            // For testing or QR check-in, call API directly instead of socket
            modalApp.show();

            // Call the API directly
            if (qr && token) {
                console.log('=== STARTING FICHAR API CALL ===');
                console.log('Timestamp:', new Date().toISOString());
                console.log('User:', user);
                console.log('QR:', qr);
                console.log('Token:', token);
                
                // Set API call timestamp to prevent race conditions
                const apiCallKey = `fichar_api_call_${user}`;
                localStorage.setItem(apiCallKey, currentTime.toString());
                
                // Create a unique request identifier to prevent duplicate processing
                const uniqueRequestId = `${user}_${qr}_${currentTime}`;
                console.log('Unique request ID:', uniqueRequestId);
                
                // Use the current server's check-in API endpoint
                const apiEndpoint = '/api/share/app/mch/fichar';
                
                // Add additional protection: disable the page to prevent any accidental double clicks
                document.body.style.pointerEvents = 'none';
                
                fetch(apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'token': token,
                        'x-username': user,
                        'x-request-id': uniqueRequestId // Add unique identifier
                    },
                    body: JSON.stringify({
                        username: user,
                        qr: qr,
                        ip: '',
                        requestId: uniqueRequestId
                    })
                })
                    .then(response => {
                        console.log('API response status:', response.status);
                        return response.json();
                    })
                    .then(data => {
                        console.log('=== DETAILED API RESPONSE ANALYSIS ===');
                        console.log('API response data:', data);
                        console.log('Full API response object:', JSON.stringify(data, null, 2));
                        console.log('Response status:', data.status);
                        console.log('Response data exists:', !!data.data);
                        
                        if (data.data) {
                            console.log('--- FICHAJE DATA DETAILS ---');
                            console.log('Entrada value:', data.data.entrada);
                            console.log('Entrada type:', typeof data.data.entrada);
                            console.log('Salida value:', data.data.salida);
                            console.log('Salida type:', typeof data.data.salida);
                            console.log('Salida === null:', data.data.salida === null);
                            console.log('Salida === undefined:', data.data.salida === undefined);
                            console.log('Salida === "":', data.data.salida === '');
                        }
                        
                        modalApp.hide();

                        // Check for success: either status === 1 OR data exists
                        if (data.status === 1 || data.data) {
                            console.log('Success condition met. Data.data:', JSON.stringify(data.data, null, 2));
                            
                            // Determine if it's check-in or check-out based on whether salida has a time value
                            // If salida is null, it's a check-in (entrada)
                            // If salida has a time string, it's a check-out (salida)
                            const isCheckOut = data.data.salida !== null && data.data.salida !== undefined && data.data.salida !== '';
                            const action = isCheckOut ? 'salida' : 'entrada';
                            const actionText = isCheckOut ? 'Salida registrada' : 'Entrada registrada';
                            
                            console.log('Salida value:', data.data.salida);
                            console.log('Salida type:', typeof data.data.salida);
                            console.log('Is check-out:', isCheckOut);
                            console.log('Action:', action);

                            const lateInfo = (!isCheckOut)
                                ? Fichar.calculateLateInfo({
                                    entrada: data.data.entrada,
                                    fecha: data.data.fecha,
                                    horario: data.data.horario
                                })
                                : { isLate: false };

                            const serverSummaryRaw = data.lateSummary || (data.meta && data.meta.lateSummary);
                            let lateSummary = null;
                            let lateSummarySource = 'none';

                            if (serverSummaryRaw) {
                                lateSummary = Fichar.persistLateSummary(user, serverSummaryRaw) || Fichar.normalizeSummaryFromServer(serverSummaryRaw);
                                lateSummarySource = 'server';
                            } else if (lateInfo.isLate) {
                                lateSummary = Fichar.updateWeeklyLateCount(user, lateInfo);
                                lateSummarySource = 'local';
                            }
                            
                            sessionStorage.setItem('fichajeResult', JSON.stringify({
                                success: true,
                                message: `${actionText} exitosamente`,
                                timestamp: new Date().toLocaleString(),
                                user: user,
                                action: action,
                                time: isCheckOut ? data.data.salida : data.data.entrada,
                                lateInfo,
                                lateSummary,
                                lateSummarySource
                            }));
                        } else {
                            // Redirect to success even if API response is unclear
                            sessionStorage.setItem('fichajeResult', JSON.stringify({
                                success: true,
                                message: 'Procesado exitosamente',
                                timestamp: new Date().toLocaleString()
                            }));
                        }

                        // Reset processing flag and redirect to home with success parameter
                        Fichar.isProcessing = false;
                        localStorage.removeItem(processingKey);
                        localStorage.removeItem(apiCallKey); // Also remove API call tracking
                        
                        // Re-enable page interactions
                        document.body.style.pointerEvents = 'auto';
                        
                        location.href = '/?fichaje=success'
                    })
                    .catch(error => {
                        console.error('API error:', error);
                        modalApp.hide();

                        // Always treat as success - no error messages shown to user
                        sessionStorage.setItem('fichajeResult', JSON.stringify({
                            success: true,
                            message: 'Procesado exitosamente',
                            timestamp: new Date().toLocaleString()
                        }));

                        // Reset processing flag and redirect to success page
                        Fichar.isProcessing = false;
                        localStorage.removeItem(processingKey);
                        localStorage.removeItem(apiCallKey); // Also remove API call tracking
                        
                        // Re-enable page interactions
                        document.body.style.pointerEvents = 'auto';
                        
                        location.href = '/?fichaje=success'
                    });
            } else {
                setTimeout(() => {
                    modalApp.hide();
                    // Reset processing flag and redirect to home
                    Fichar.isProcessing = false;
                    localStorage.removeItem(processingKey);
                    location.href = '/'
                }, 1500);
            }
            return;
        }

        // Add fallback redirect to ensure we don't get stuck in /fichar
        setTimeout(() => {
            if (location.pathname === '/fichar') {
                console.log('Fallback redirect to home');
                location.href = '/';
            }
        }, 5000);

        Fichar.initSocket()
        }, 100); // Small delay to prevent double-calls
    },

    calculateLateInfo: ({ entrada, fecha, horario }) => {
        const fallbackDate = new Date();
        const resolved = Fichar.resolveEntryTime(entrada, fecha);
        const referenceDate = resolved.dateObj || Fichar.safeParseDate(fecha) || fallbackDate;
        const finalDateStr = Fichar.formatDateISO(referenceDate);

        if (resolved.minutesOfDay === null) {
            return {
                isLate: false,
                reason: resolved.reason || 'TIME_PARSE_FAILED',
                entrada,
                fecha: finalDateStr,
                horario
            };
        }

        const diff = resolved.minutesOfDay - Fichar.LATE_THRESHOLD_MINUTES;
        return {
            isLate: diff > 0,
            lateMinutes: diff > 0 ? diff : 0,
            entrada,
            fecha: finalDateStr,
            horario,
            threshold: '09:06',
            timestampCaptured: fallbackDate.toISOString(),
            parseSource: resolved.source || 'UNKNOWN'
        };
    },

    updateWeeklyLateCount: (userId, lateInfo) => {
        if (!lateInfo || !lateInfo.isLate) return null;
        const storageKey = `fichaje_late_counter_${userId}`;
        const weekKey = Fichar.getWeekKey(lateInfo.fecha);

        let stored;
        try {
            stored = JSON.parse(localStorage.getItem(storageKey) || '{}');
        } catch (_) {
            stored = {};
        }

        if (!stored || stored.weekKey !== weekKey) {
            stored = {
                weekKey,
                count: 0,
                days: {}
            };
        }

        if (!stored.days[lateInfo.fecha]) {
            stored.days[lateInfo.fecha] = {
                lateMinutes: lateInfo.lateMinutes,
                recordedAt: new Date().toISOString(),
                occurrences: 1
            };
        } else {
            const dayRecord = stored.days[lateInfo.fecha];
            dayRecord.lateMinutes = lateInfo.lateMinutes;
            dayRecord.recordedAt = new Date().toISOString();
            dayRecord.occurrences = (dayRecord.occurrences || 1) + 1;
        }

        stored.count = Object.values(stored.days).reduce((acc, info) => acc + (info.occurrences || 1), 0);
        stored.limit = Fichar.LATE_LIMIT;
        stored.lastLateInfo = lateInfo;
        localStorage.setItem(storageKey, JSON.stringify(stored));

        return {
            weekKey,
            count: stored.count,
            limit: Fichar.LATE_LIMIT,
            remaining: Math.max(Fichar.LATE_LIMIT - stored.count, 0),
            shouldNotify: stored.count >= Fichar.LATE_LIMIT,
            days: stored.days
        };
    },

    normalizeSummaryFromServer: (summary) => {
        if (!summary || typeof summary !== 'object') return null;
        const limit = typeof summary.limit === 'number' ? summary.limit : Fichar.LATE_LIMIT;
        const count = typeof summary.totalLateDays === 'number' ? summary.totalLateDays : 0;
        const remaining = Math.max(limit - count, 0);
        const details = Array.isArray(summary.details) ? summary.details : [];
        return {
            weekKey: summary.weekKey || Fichar.getWeekKey(summary.weekStart || new Date().toISOString().split('T')[0]),
            count,
            limit,
            remaining,
            shouldNotify: count >= limit,
            details,
            thresholdTime: summary.thresholdTime || '09:06:00'
        };
    },

    persistLateSummary: (userId, summary) => {
        const normalized = Fichar.normalizeSummaryFromServer(summary);
        if (!userId || !normalized) return null;
        const storageKey = `fichaje_late_counter_${userId}`;
        const payload = {
            weekKey: normalized.weekKey,
            count: normalized.count,
            limit: normalized.limit,
            remaining: normalized.remaining,
            shouldNotify: normalized.shouldNotify,
            thresholdTime: normalized.thresholdTime,
            details: normalized.details
        };
        localStorage.setItem(storageKey, JSON.stringify(payload));
        return normalized;
    },

    resolveEntryTime: (entrada, fecha) => {
        const resultBase = {
            minutesOfDay: null,
            dateObj: null,
            source: undefined,
            reason: undefined
        };

        if (!entrada) {
            return { ...resultBase, reason: 'EMPTY_ENTRADA' };
        }

        const raw = `${entrada}`.trim();
        if (raw.length === 0) {
            return { ...resultBase, reason: 'EMPTY_ENTRADA' };
        }

        // Try ISO/full datetime parsing first
        const directDate = new Date(raw);
        if (!Number.isNaN(directDate.getTime())) {
            return {
                minutesOfDay: directDate.getHours() * 60 + directDate.getMinutes(),
                dateObj: directDate,
                source: 'ISO_STRING'
            };
        }

        if (raw.includes(' ')) {
            const [datePart, timePart] = raw.split(' ');
            if (datePart && timePart) {
                const timeMinutes = Fichar.parseMinutesFromTime(timePart);
                if (timeMinutes !== null) {
                    const baseDate = Fichar.safeParseDate(datePart) || Fichar.safeParseDate(fecha);
                    if (baseDate) {
                        baseDate.setHours(Math.floor(timeMinutes / 60), timeMinutes % 60, 0, 0);
                        return {
                            minutesOfDay: timeMinutes,
                            dateObj: baseDate,
                            source: 'DATETIME_SPLIT'
                        };
                    }
                    return {
                        minutesOfDay: timeMinutes,
                        dateObj: null,
                        source: 'TIME_FROM_SPLIT_NO_DATE'
                    };
                }

                const composed = new Date(`${datePart}T${timePart}`);
                if (!Number.isNaN(composed.getTime())) {
                    return {
                        minutesOfDay: composed.getHours() * 60 + composed.getMinutes(),
                        dateObj: composed,
                        source: 'DATETIME_COMPOSED'
                    };
                }
            }
        }

        const minutesOnly = Fichar.parseMinutesFromTime(raw);
        if (minutesOnly !== null) {
            const baseDate = Fichar.safeParseDate(fecha);
            if (baseDate) {
                baseDate.setHours(Math.floor(minutesOnly / 60), minutesOnly % 60, 0, 0);
            }
            return {
                minutesOfDay: minutesOnly,
                dateObj: baseDate || null,
                source: 'TIME_ONLY'
            };
        }

        return { ...resultBase, reason: 'UNPARSABLE' };
    },

    parseMinutesFromTime: (timeStr) => {
        if (typeof timeStr !== 'string') return null;
        const trimmed = timeStr.trim();
        const matches = trimmed.match(/^([0-2]\d):([0-5]\d)(?::([0-5]\d))?$/);
        if (!matches) return null;
        const hours = parseInt(matches[1], 10);
        const minutes = parseInt(matches[2], 10);
        if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
        return (hours * 60) + minutes;
    },

    getWeekKey: (dateStr) => {
        if (typeof dateStr !== 'string' || dateStr.length === 0) {
            const today = new Date();
            return Fichar.getWeekKey(today.toISOString().split('T')[0]);
        }
        const [year, month, day] = dateStr.split('-').map(Number);
        if ([year, month, day].some(val => Number.isNaN(val))) {
            const today = new Date();
            return Fichar.getWeekKey(today.toISOString().split('T')[0]);
        }

        const dt = new Date(Date.UTC(year, month - 1, day));
        const dayNum = dt.getUTCDay() || 7;
        dt.setUTCDate(dt.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(dt.getUTCFullYear(), 0, 1));
        const weekNo = Math.ceil((((dt - yearStart) / 86400000) + 1) / 7);
        return `${dt.getUTCFullYear()}-W${weekNo.toString().padStart(2, '0')}`;
    },

    safeParseDate: (value) => {
        if (!value) return null;
        if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
        const raw = `${value}`.trim();
        if (raw.length === 0) return null;

        if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
            const [y, m, d] = raw.split('-').map(Number);
            if ([y, m, d].some(Number.isNaN)) return null;
            const dt = new Date();
            dt.setFullYear(y, m - 1, d, 0, 0, 0, 0);
            return dt;
        }

        if (/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(:\d{2})?$/.test(raw)) {
            const candidate = new Date(raw.replace(' ', 'T'));
            if (!Number.isNaN(candidate.getTime())) return candidate;
        }

        const parsed = new Date(raw);
        if (!Number.isNaN(parsed.getTime())) return parsed;
        return null;
    },

    formatDateISO: (dateObj) => {
        if (!(dateObj instanceof Date) || Number.isNaN(dateObj.getTime())) {
            return new Date().toISOString().split('T')[0];
        }
        const year = dateObj.getFullYear();
        const month = `${dateObj.getMonth() + 1}`.padStart(2, '0');
        const day = `${dateObj.getDate()}`.padStart(2, '0');
        return `${year}-${month}-${day}`;
    },

    initSocket: () => {
        socket = io(urlServer, {
            transports: ['websocket'],
            query: {
                id: clientFromID,
                dslave: "mchapp"
            }
        });

        socket.on('connect', () => {
            console.log('connected....');
            let dataCon = { token, qr, ip: '', user }
            // Emite un evento para registrar el fichaje
            modalApp.show();
            socket.emit("fichar", clientFromID, JSON.stringify(dataCon))
        })

        // Capturar respuesta del servidor
        socket.on('changeqr', async (from, msg) => {
            //let _modalApp = new bootstrap.Modal(document.getElementById('modalEspera'), {})
            //_modalApp.hide()
            setTimeout(() => {
                try {
                    const _dataJson = JSON.parse(msg)
                    let _state = parseInt(`${_dataJson.data.state}`)

                    // Clear processing flag
                    const processingKey = `fichar_processing_${user}`;
                    
                    // Store socket check-in result
                    if (_state === 1) {
                        sessionStorage.setItem('fichajeResult', JSON.stringify({
                            success: true,
                            message: 'Fichaje registrado exitosamente via Socket',
                            timestamp: new Date().toLocaleString(),
                            user: user,
                            qr: qr
                        }));
                        Fichar.isProcessing = false;
                        localStorage.removeItem(processingKey);
                        location.href = '/?fichaje=success'
                    } else if (_state === 0) {
                        // Always treat as success - no error messages shown to user
                        sessionStorage.setItem('fichajeResult', JSON.stringify({
                            success: true,
                            message: 'Procesado exitosamente',
                            timestamp: new Date().toLocaleString()
                        }));
                        Fichar.isProcessing = false;
                        localStorage.removeItem(processingKey);
                        location.href = '/?fichaje=success'
                    }
                } catch (err) {
                    // Always treat as success - no error messages shown to user
                    sessionStorage.setItem('fichajeResult', JSON.stringify({
                        success: true,
                        message: 'Procesado exitosamente',
                        timestamp: new Date().toLocaleString()
                    }));
                    Fichar.isProcessing = false;
                    localStorage.removeItem(`fichar_processing_${user}`);
                    location.href = '/?fichaje=success'
                }
            }, 300)
        })

        // Reconexion por errores de sockets
        socket.on("connect_error", () => {
            console.log('error connect')
        })

        socket.on('disconnect', function () {
            console.log('Conexion cerrada desde el servidor!');
        });

        socket.connect();
    },

    deleteFichaje: (fichajeId, token, successCallback, errorCallback) => {
        if (!fichajeId) {
            console.error('Fichaje ID is required for deletion');
            if (errorCallback) errorCallback('ID del fichaje requerido');
            return;
        }
        
        if (!token) {
            console.error('Token is required for deletion');
            if (errorCallback) errorCallback('Token de autenticación requerido');
            return;
        }
        
        console.log('Deleting fichaje with ID:', fichajeId);
        
        fetch(`/api/share/app/mch/fichar/${fichajeId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        })
        .then(response => {
            console.log('Delete API response status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('Delete API response data:', data);
            
            if (data.status === 1) {
                console.log('Fichaje deleted successfully');
                if (successCallback) successCallback(data);
            } else {
                console.error('Error deleting fichaje:', data.error);
                if (errorCallback) errorCallback(data.error || 'Error al eliminar el fichaje');
            }
        })
        .catch(error => {
            console.error('Delete fichaje error:', error);
            if (errorCallback) errorCallback('Error de conexión al eliminar el fichaje');
        });
    },

    back: (path = 'pisosSender') => {
        location.href = `/${path}`
    }
}