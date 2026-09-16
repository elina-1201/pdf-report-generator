import { Injectable } from '@nestjs/common';
import { createReadStream, existsSync, type ReadStream } from 'node:fs';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * Owns the on-disk layout of generated reports.
 *
 * Callers deal in report ids only — where files live and how a file name is
 * derived from an id is nobody else's business. Keeping this in one place is
 * what lets a file be addressed by the same id from the service and from the
 * controller without either of them touching the filesystem layout.
 */
@Injectable()
export class ReportStorageService {
    private readonly directory = join(process.cwd(), 'reports');

    /**
     * The path recorded on the report row. Note this is *not* a served URL —
     * clients fetch a report through GET /reports/:id/file.
     */
    storedPath(reportId: string): string {
        return `/reports/${this.fileName(reportId)}`;
    }

    async write(reportId: string, contents: Buffer): Promise<void> {
        await mkdir(this.directory, { recursive: true });
        await writeFile(this.diskPath(reportId), contents);
    }

    async remove(reportId: string): Promise<void> {
        await rm(this.diskPath(reportId), { force: true });
    }

    exists(reportId: string): boolean {
        return existsSync(this.diskPath(reportId));
    }

    createReadStream(reportId: string): ReadStream {
        return createReadStream(this.diskPath(reportId));
    }

    private fileName(reportId: string): string {
        return `${reportId}.pdf`;
    }

    private diskPath(reportId: string): string {
        return join(this.directory, this.fileName(reportId));
    }
}
