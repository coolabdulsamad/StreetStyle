import emailjs from '@emailjs/browser';
import React, { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { toast } from 'sonner';

const subjectOptions = [
	{ value: 'Order Inquiry', label: 'Order Inquiry' },
	{ value: 'Return/Exchange', label: 'Return/Exchange' },
	{ value: 'Product Question', label: 'Product Question' },
	{ value: 'Shipping Inquiry', label: 'Shipping Inquiry' },
	{ value: 'Other', label: 'Other' },
];

const ContactPage = () => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		subject: '',
		message: '',
	});
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			// Combine subject and message for the template
			const templateParams = {
				name: formData.name,
				email: formData.email,
				message: `Subject: ${formData.subject}\n\n${formData.message}`,
			};

			await emailjs.send(
				import.meta.env.VITE_SERVICE_ID,
				import.meta.env.VITE_TEMPLATE_ID,
				templateParams,
				import.meta.env.VITE_PUBLIC_KEY
			);

			toast.success("Message sent successfully! We'll get back to you soon.");
			setFormData({ name: '', email: '', subject: '', message: '' });
		} catch (error) {
			console.error('Error sending email:', error);
			toast.error('Failed to send message. Please try again later.');
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	return (
		<PageLayout>
			<div className="container max-w-6xl py-10">
				<div className="text-center mb-10">
					<h1 className="text-3xl font-bold mb-4">Contact Us</h1>
					<p className="text-muted-foreground">
						Having questions? We&apos;re here to help. Reach out to us anytime.
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Contact Form */}
					<div className="lg:col-span-2">
						<Card>
							<CardHeader>
								<CardTitle>Send us a Message</CardTitle>
							</CardHeader>
							<CardContent>
								<form onSubmit={handleSubmit} className="space-y-6">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<Label htmlFor="name">Name</Label>
											<Input
												id="name"
												value={formData.name}
												onChange={(e) => handleChange('name', e.target.value)}
												required
											/>
										</div>
										<div>
											<Label htmlFor="email">Email</Label>
											<Input
												id="email"
												type="email"
												value={formData.email}
												onChange={(e) => handleChange('email', e.target.value)}
												required
											/>
										</div>
									</div>

									<div>
										<Label htmlFor="subject">Subject</Label>
										<Select
											value={formData.subject}
											onValueChange={(value) => handleChange('subject', value)}
											required
										>
											<SelectTrigger>
												<SelectValue placeholder="Select a subject" />
											</SelectTrigger>
											<SelectContent>
												{subjectOptions.map((opt) => (
													<SelectItem key={opt.value} value={opt.label}>
														{opt.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>

									<div>
										<Label htmlFor="message">Message</Label>
										<Textarea
											id="message"
											rows={5}
											value={formData.message}
											onChange={(e) => handleChange('message', e.target.value)}
											required
										/>
									</div>

									<Button type="submit" className="w-full" disabled={loading}>
										{loading ? 'Sending...' : 'Send Message'}
									</Button>
								</form>
							</CardContent>
						</Card>
					</div>

					{/* Contact Information */}
					<div className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Get in Touch</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center gap-3">
									<Mail className="w-5 h-5 text-primary" />
									<div>
										<p className="font-medium">Email</p>
										<a
											href="mailto:ezem77743@gmail.com"
											className="text-sm text-muted-foreground hover:text-primary transition-colors"
										>
											ezem77743@gmail.com
										</a>
									</div>
								</div>

								<div className="flex items-center gap-3">
									<Phone className="w-5 h-5 text-primary" />
									<div>
										<p className="font-medium">Phone</p>
										<a
											href="tel:+2348134833065"
											className="text-sm text-muted-foreground hover:text-primary transition-colors"
										>
											+234 813 483 3065
										</a>
									</div>
								</div>

								<div className="flex items-center gap-3">
									<MapPin className="w-5 h-5 text-primary" />
									<div>
										<p className="font-medium">Address</p>
										<p className="text-sm text-muted-foreground">
											123 Lagos Street
											<br />
											Lagos, Nigeria
										</p>
									</div>
								</div>

								<div className="flex items-center gap-3">
									<Clock className="w-5 h-5 text-primary" />
									<div>
										<p className="font-medium">Hours</p>
										<p className="text-sm text-muted-foreground">
											Mon-Fri: 9AM-6PM
											<br />
											Sat-Sun: 10AM-4PM
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</PageLayout>
	);
};

export default ContactPage;
