package org.firstapproval.backend.core.domain.notification

import io.jsonwebtoken.lang.Strings
import mu.KotlinLogging.logger
import org.firstapproval.backend.core.config.Properties
import org.firstapproval.backend.core.config.Properties.EmailProperties
import org.firstapproval.backend.core.domain.publication.Publication
import org.firstapproval.backend.core.domain.user.User
import org.firstapproval.backend.core.infra.mail.MailService
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.thymeleaf.context.Context
import org.thymeleaf.spring6.SpringTemplateEngine

@Service
class NotificationService(
    private val emailProperties: EmailProperties,
    private val templateEngine: SpringTemplateEngine,
    private val mailService: MailService,
    private val frontendProperties: Properties.FrontendProperties,
    @Value("\${tech-support-email}")
    private val techSupportEmail: String,
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
        val context = Context()
        val model: MutableMap<String, Any> = HashMap()
        model["link"] = link
        model["email"] = email
        context.setVariables(model)
        val html = templateEngine.process("password-restore-email-template", context)
        mailService.send(email, "[FirstApproval] Password recovery link", html, true)
    }

    fun sendEmailPasswordChanged(email: String, name: String?) {
        if (emailProperties.noopMode) {
            log.info { "password changed email" }
            return
        }
        val context = Context()
        val model: MutableMap<String, Any> = HashMap()
        model["greeting"] = "Hi $name,"
        model["email"] = email
        context.setVariables(model)
        val html = templateEngine.process("password-changed", context)
        mailService.send(email, "[FirstApproval] Password changed", html, true)
    }

    fun sendEmailForCoAuthorsChanged(publication: Publication) {
        if (emailProperties.noopMode) {
            log.info { "emails for co-authors sent" }
            return
        }
        val emails =
            publication.unconfirmedAuthors.map { it.email } + publication.confirmedAuthors.filter { it.user.id != publication.creator.id }
                .map { it.user.email }
        val authors = publication.confirmedAuthors.map { "${it.user.firstName} ${it.user.lastName}" } +
            publication.unconfirmedAuthors.map { "${it.firstName} ${it.lastName}" }
        emails.map { email ->
            if (email != null) {
                val context = Context()
                val model: MutableMap<String, Any> = HashMap()
                model["authors"] = authors.joinToString()
                model["publicationLink"] = "${frontendProperties.url}/publication/${publication.id}"
                model["title"] = publication.title ?: publication.id
                model["email"] = email
                context.setVariables(model)
                val html = templateEngine.process("you-have-been-added-as-co-author", context)
                mailService.send(email, "[FirstApproval] You've been credited as a co-author in dataset", html, true)
            }
        }
    }

    fun sendArchivePassword(email: String, publicationName: String?, authors: String, password: String) {
        if (emailProperties.noopMode) {
            log.info { "Archive password $password" }
            return
        }
        val context = Context()
        val model: MutableMap<String, Any> = HashMap()
        model["publicationName"] = publicationName!!
        model["password"] = password
        model["email"] = email
        model["authors"] = authors
        context.setVariables(model)
        val html = templateEngine.process("password-of-dataset", context)
        mailService.send(email, "[FirstApproval] Password of dataset", html, true)
    }

    fun sendReportEmailToSupport(reporterEmail: String, content: String) {
        if (emailProperties.noopMode) {
            log.info { "new report" }
            return
        }
        mailService.send(techSupportEmail, "[FirstApproval] New report received from $reporterEmail", content)
    }

    fun sendDatasetIsReadyForDownload(publication: Publication, user: User) {
        if (emailProperties.noopMode) {
            log.info { "Dataset is ready for download" }
            return
        }
        if (user.email != null) {
            val authors = publication.confirmedAuthors.map { "${it.user.firstName} ${it.user.lastName}" } +
                publication.unconfirmedAuthors.map { "${it.firstName} ${it.lastName}" }

            val context = Context()
            val model: MutableMap<String, Any> = HashMap()
            model["authors"] = authors.joinToString()
            model["publicationLink"] = "${frontendProperties.url}/publication/${publication.id}"
            model["title"] = publication.title ?: publication.id
            model["email"] = user.email.toString()
            context.setVariables(model)
            val html = templateEngine.process("dataset-is-ready-for-download.html", context)
            mailService.send(user.email.toString(), "[FirstApproval] Dataset is ready for download: ${publication.title}", html, true)
        }
    }
}
