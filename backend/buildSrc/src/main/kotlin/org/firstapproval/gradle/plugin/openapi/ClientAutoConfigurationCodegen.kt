package org.firstapproval.gradle.plugin.openapi

import com.samskivert.mustache.Mustache.Lambda
import io.swagger.v3.oas.models.OpenAPI
import io.swagger.v3.oas.models.Operation
import java.io.File.separator
import org.openapitools.codegen.DefaultCodegen
import org.openapitools.codegen.SupportingFile
import org.openapitools.codegen.utils.StringUtils.camelize
import org.openapitools.codegen.utils.StringUtils.dashize
import org.openapitools.codegen.utils.StringUtils.underscore

class ClientAutoConfigurationCodegen : DefaultCodegen() {

    companion object {
        const val CLIENT_AUTO_CONFIGURATION_GENERATOR_NAME = "client-auto-configuration"
    }

    init {
        templateDir = "client-config-template"
        embeddedTemplateDir = "client-config-template"
    }

    override fun getName(): String = CLIENT_AUTO_CONFIGURATION_GENERATOR_NAME

    override fun processOpts() {
        super.processOpts()

        val securitySchemes = openAPI.getSecuritySchemesConfigs()
        additionalProperties["securitySchemesConfigs"] = securitySchemes
        additionalProperties["autoconfigurationClassNames"] = securitySchemes.joinToString("\n") {
            "${apiPackage}.${it.schemeName}ClientConfig"
        }
        additionalProperties["kebabCase"] = Lambda { frag, out -> out.write(dashize(frag.execute())) }
        additionalProperties["lowerUnderscore"] = Lambda { frag, out -> out.write(underscore(frag.execute())) }
        additionalProperties["upperUnderscore"] =
            Lambda { frag, out -> out.write(underscore(frag.execute()).uppercase()) }

        supportingFiles.add(
            SupportingFile(
                "ClientConfigAutoconfiguration.mustache",
                "src/main/kotlin/${apiPackage.replace(".", separator)}",
                "OpenApiClientConfig.kt"
            )
        )
        supportingFiles.add(
            SupportingFile(
                "org.springframework.boot.autoconfigure.AutoConfiguration.imports.mustache",
                "src/main/resources/META-INF/spring",
                "org.springframework.boot.autoconfigure.AutoConfiguration.imports"
            )
        )
    }

    private fun OpenAPI.getSecuritySchemesConfigs(): List<SchemeConfig> {
        val operations = paths.values.flatMap { it.readOperations() }
        val schemes = components.securitySchemes?.keys?.distinct() ?: emptyList()
        return schemes.map {
            SchemeConfig(
                schemeName = it,
                isBasicAuth = components.securitySchemes[it]!!.scheme == "basic",
                isBearerAuth = components.securitySchemes[it]!!.scheme == "bearer",
                classNames = operations.getTagsByScheme(it)
            )
        }
    }

    private fun List<Operation>.getTagsByScheme(scheme: String): List<String> =
        filter { operation -> operation.security != null && operation.security.any { it.containsKey(scheme) } }
            .flatMap { it.tags }
            .distinct()
            .map { camelize(underscore(it)) }
}

@Suppress("unused")
private class SchemeConfig(
    val schemeName: String,
    val isBasicAuth: Boolean,
    val isBearerAuth: Boolean,
    val classNames: List<String>
)


