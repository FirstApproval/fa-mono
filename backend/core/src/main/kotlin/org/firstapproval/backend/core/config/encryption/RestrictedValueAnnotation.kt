package org.firstapproval.backend.core.config.encryption

import mu.KotlinLogging.logger
import org.firstapproval.backend.core.utils.allFields
import org.firstapproval.backend.core.utils.getValue
import org.springframework.beans.factory.config.BeanPostProcessor
import org.springframework.boot.SpringApplication.exit
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.ApplicationContext
import java.lang.reflect.Field
import kotlin.annotation.AnnotationRetention.RUNTIME
import kotlin.annotation.AnnotationTarget.FIELD
import kotlin.system.exitProcess

@Target(FIELD)
@Retention(RUNTIME)
@Repeatable
annotation class RestrictedValue(
    val environment: Environment,
    val value: String
)

enum class Environment(val value: String) {
    LOCAL("local"),
    DEV("dev"),
    STAGE("stage"),
    PROD("prod");

    companion object {
        fun getByValue(value: String) = values().single { it.value == value }
    }
}

class RestrictedValueAnnotationBeanPostProcessor(
    private val context: ApplicationContext
) : BeanPostProcessor {

    private val log = logger {}
    private val activeEnv = context.getActiveEnv()

    override fun postProcessBeforeInitialization(bean: Any, beanName: String): Any? {
        bean::class.java
            .takeIf { it.isAnnotationPresent(ConfigurationProperties::class.java) }
            ?.allFields()
            ?.forEach { field ->
                val restrictedValue = field.getEnforcedValueForEnv(activeEnv)
                if (restrictedValue != null && restrictedValue != field.getValue(bean)?.toString()) {
                    log.error { "Property ${field.declaringClass.simpleName}.${field.name} must have '$restrictedValue' value" }
                    exit()
                }
            }
        return super.postProcessBeforeInitialization(bean, beanName)
    }

    private fun ApplicationContext.getActiveEnv(): Environment {
        val envProfiles = Environment.values().map { it.value }
        val activeEnvProfiles = envProfiles.filter { environment.activeProfiles.contains(it) }
        if (activeEnvProfiles.isEmpty()) {
            log.error { "Declare at least one of $envProfiles, appropriate for your environment" }
            exit()
        }
        if (activeEnvProfiles.size > 1) {
            log.error { "Declare only one profile of $envProfiles, appropriate for your environment, currently active: $activeEnvProfiles" }
            exit()
        }
        return Environment.getByValue(activeEnvProfiles.single())
    }

    private fun Field.getEnforcedValueForEnv(env: Environment): String? = getAnnotationsByType(RestrictedValue::class.java)
        .firstOrNull { it.environment == env }
        ?.value

    private fun exit() {
        exit(context)
        exitProcess(1)
    }
}
