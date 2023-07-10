package org.firstapproval.backend.core.domain.notification

import io.jsonwebtoken.lang.Strings
import mu.KotlinLogging.logger
import org.firstapproval.backend.core.config.Properties
import org.firstapproval.backend.core.config.Properties.EmailProperties
import org.firstapproval.backend.core.domain.main.MailService
import org.firstapproval.backend.core.domain.user.User
import org.springframework.stereotype.Service
import org.thymeleaf.context.Context
import org.thymeleaf.spring6.SpringTemplateEngine

@Service
class NotificationService(
    private val emailProperties: EmailProperties,
    private val templateEngine: SpringTemplateEngine,
    private val mailService: MailService,
    private val frontendProperties: Properties.FrontendProperties
) {
    val log = logger {}

    fun sendConfirmationEmail(code: String, link: String, email: String, template: String) {
        if (emailProperties.noopMode) {
            log.info { code }
            return
        }
        val context = Context()
        val model: MutableMap<String, Any> = HashMap()
        model["code"] = code
        model["link"] = link
        model["email"] = email
        context.setVariables(model)
        val html = templateEngine.process(template, context)
        mailService.send(email, "[FirstApproval] Confirming an email address", html, true)
    }

    fun sendYouAlreadyHaveAccount(user: User) {
        if (emailProperties.noopMode) {
            log.info { "You already registered via oauth" }
            return
        }
        val providers = user.externalIds.keys.map { Strings.capitalize(it.name.lowercase()) }
        val content = "You already signed up via ${providers.joinToString()}"
        mailService.send(user.email!!, "[FirstApproval] You already have account", content)
    }

    fun sendEmailForPasswordReset(email: String, resetId: String) {
        val link = "${frontendProperties.passwordChangeConfirmationUrl}/${resetId}"
        if (emailProperties.noopMode) {
            log.info { link }
            return
        }
        mailService.send(email, "[FirstApproval] Password recovery link", link)
    }

}
