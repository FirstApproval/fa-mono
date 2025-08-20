ALTER TABLE collaboration_request_messages ADD email_notification_status TEXT NOT NULL DEFAULT 'NOT_REQUIRED';
ALTER TABLE collaboration_request_messages ALTER email_notification_status DROP DEFAULT;
