package org.firstapproval.backend.core.domain.notification

import mu.KotlinLogging.logger
import org.firstapproval.backend.core.config.Properties.EmailProperties
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.MimeMessageHelper
import org.springframework.stereotype.Service
import org.thymeleaf.context.Context
import org.thymeleaf.spring6.SpringTemplateEngine
import java.nio.charset.StandardCharsets.UTF_8

@Service
class NotificationService(
    private val emailProperties: EmailProperties,
    private val templateEngine: SpringTemplateEngine,
    private val emailSender: JavaMailSender,
) {
    val log = logger {}

    fun sendConfirmationEmail(code: String, link: String, email: String, template: String) {
        if (emailProperties.noopMode) {
            log.info { code }
            return
        }
        val message = emailSender.createMimeMessage()
        val helper = MimeMessageHelper(message, UTF_8.name())
        val context = Context()
        val model: MutableMap<String, Any> = HashMap()
        model["code"] = code
        model["link"] = link
        model["email"] = email
        context.setVariables(model)
        val html = templateEngine.process(template, context)
        helper.setFrom(emailProperties.from)
        helper.setTo(email)
        helper.setText(html, true)
        helper.setSubject("[FirstApproval] Confirming an email address")
        emailSender.send(message)
    }
}
