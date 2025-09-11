ALTER TABLE email_registration_confirmations ADD COLUMN utm_medium TEXT;
ALTER TABLE email_registration_confirmations ADD COLUMN utm_campaign TEXT;

ALTER TABLE users ADD COLUMN utm_medium TEXT;
ALTER TABLE users ADD COLUMN utm_campaign TEXT;

ALTER TABLE visitors ADD COLUMN utm_medium TEXT;
ALTER TABLE visitors ADD COLUMN utm_campaign TEXT;
