package org.firstapproval.backend.core.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.JavaMailSenderImpl

@Configuration
class EmailServiceConfig {

    @Bean
    fun javaMailSender(emailProperties: Properties.EmailProperties): JavaMailSender {
        val mailSender = JavaMailSenderImpl()
        mailSender.host = emailProperties.host
        mailSender.port = emailProperties.port
        mailSender.username = emailProperties.username
        mailSender.password = emailProperties.password

        val props = mailSender.javaMailProperties
        props["mail.transport.protocol"] = emailProperties.transportProtocol
        props["mail.smtp.auth"] = emailProperties.smtpAuth
        props["mail.smtp.starttls.enable"] = emailProperties.smtpStarttlsEnable
        props["mail.smtp.ssl.enable"] = emailProperties.smtpSslEnable
        return mailSender
    }
}
