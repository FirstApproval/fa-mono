package org.firstapproval.backend.core.config

import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.transaction.PlatformTransactionManager
import org.springframework.transaction.support.TransactionTemplate

const val REQUIRE_NEW_TRANSACTION_TEMPLATE = "requireNewTransactionTemplate"

@Configuration
class TransactionTemplateConfig {
    @Bean
    @Qualifier(REQUIRE_NEW_TRANSACTION_TEMPLATE)
    fun transactionTemplateRequiresNew(transactionManager: PlatformTransactionManager): TransactionTemplate {
        val transactionTemplate = TransactionTemplate(transactionManager)
        transactionTemplate.setPropagationBehaviorName("PROPAGATION_REQUIRES_NEW")
        return transactionTemplate
    }
}
