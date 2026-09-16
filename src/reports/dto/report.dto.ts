/**
 * The HTTP response shape for a report: what it is and where to fetch the PDF.
 *
 * `file` is the URL of the route that serves the PDF, not the `path` column
 * stored on the row.
 */
export class ReportSummaryDTO {
    id!: string;
    file!: string;

    /**
     * Derived from the id rather than read off the entity: the fetchable URL is
     * the /reports/:id/file route, whereas `Report.path` holds a location that
     * is never served.
     */
    static from(reportId: string): ReportSummaryDTO {
        return { id: reportId, file: `/reports/${reportId}/file` };
    }
}