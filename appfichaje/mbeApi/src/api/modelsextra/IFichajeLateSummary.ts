export interface IFichajeLateSummaryDay {
    fecha: string;
    entrada: string | null;
    minutosRetraso: number;
}

export interface IFichajeLateSummary {
    weekKey: string;
    weekStart: string;
    weekEnd: string;
    thresholdTime: string;
    limit: number;
    totalLateDays: number;
    details: IFichajeLateSummaryDay[];
}

export interface IFichajeLateSummaryRow {
    total_late_days: number | null;
    details: Array<{
        fecha: string;
        entrada: string | null;
        minutosRetraso: number;
    }> | null;
}
