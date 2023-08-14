package org.firstapproval.backend.core.domain.main

import org.firstapproval.backend.core.config.Properties
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.MimeMessageHelper
import org.springframework.stereotype.Service
import java.nio.charset.StandardCharsets

@Service
class MailService(
    private val emailProperties: Properties.EmailProperties,
    private val emailSender: JavaMailSender
) {

    fun send(to: String, subject: String, content: String, html: Boolean = false) {
        val message = emailSender.createMimeMessage()
        val helper = MimeMessageHelper(message, StandardCharsets.UTF_8.name())
        helper.setFrom(emailProperties.from)
        helper.setTo(to)
        helper.setText(content, html)
        helper.setSubject(subject)
        emailSender.send(message)
    }
}