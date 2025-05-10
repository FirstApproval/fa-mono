ALTER TABLE visitors
    ADD COLUMN initial_referrer TEXT;
ALTER TABLE users
    ADD COLUMN initial_referrer TEXT;
ALTER TABLE email_registration_confirmations
    ADD COLUMN initial_referrer TEXT;
