package org.firstapproval.backend.core.domain.publication

import mu.KotlinLogging.logger
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock
import org.firstapproval.backend.core.config.Properties.EmailProperties
import org.firstapproval.backend.core.config.Properties.FrontendProperties
import org.firstapproval.backend.core.domain.auth.OauthUser
import org.firstapproval.backend.core.domain.registration.EmailRegistrationConfirmation
import org.firstapproval.backend.core.domain.registration.EmailRegistrationConfirmationRepository
import org.firstapproval.backend.core.domain.user.OauthType.*
import org.firstapproval.backend.core.domain.user.limits.AuthorizationLimit
import org.firstapproval.backend.core.domain.user.limits.AuthorizationLimitRepository
import org.firstapproval.backend.core.domain.user.password.PasswordResetConfirmation
import org.firstapproval.backend.core.domain.user.password.PasswordResetConfirmationRepository
import org.firstapproval.backend.core.exception.MissingEmailException
import org.firstapproval.backend.core.exception.RecordConflictException
import org.firstapproval.backend.core.utils.generateCode
import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.MimeMessageHelper
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.security.access.AccessDeniedException
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Isolation.REPEATABLE_READ
import org.springframework.transaction.annotation.Transactional
import org.thymeleaf.context.Context
import org.thymeleaf.spring6.SpringTemplateEngine
import java.nio.charset.StandardCharsets
import java.time.ZonedDateTime.now
import java.util.*
import java.util.UUID.*
import java.util.function.*
import javax.naming.LimitExceededException

@Service
class PublicationService(
    private val publicationRepository: PublicationRepository,
) {

    val log = logger {}

    @Transactional()
    fun createDraft(): Publication {
        return publicationRepository.save(Publication(id = randomUUID()))
    }
}
