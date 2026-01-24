import nodemailer, { Transporter } from 'nodemailer';
import * as ejs from 'ejs';
import path from 'path';

export class EmailService {
	private transporter: Transporter;

	constructor() {
		this.transporter = nodemailer.createTransport({
			service: process.env.EMAIL_SERVICE,
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS,
			},
		});
	}

	/**
	 * Sends an email using an EJS template.
	 * @param templateName Template file name (without .ejs)
	 * @param envelope Recipient email and subject
	 * @param mailOptions Data to render in the template
	 */
	async sendTemplateEmail(
		templateName: string,
		envelope: { to: string; subject: string },
		mailOptions: Record<string, any>,
	): Promise<void> {
		try {
			// Resolve template path (works with TS compiled JS in dist/)
			const templatePath = path.resolve(__dirname, '../../view/emails', `${templateName}.ejs`);
			const html = (await ejs.renderFile(templatePath, mailOptions)) as string;

			await this.transporter.sendMail({
				from: process.env.EMAIL_FROM,
				to: envelope.to,
				subject: envelope.subject,
				html,
			});

		} catch (err) {
			console.error('Failed to send email:', err);
		}
	}
}
