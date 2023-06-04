package org.firstapproval.gradle.plugin

import io.spring.gradle.dependencymanagement.dsl.DependencyManagementExtension
import org.firstapproval.gradle.plugin.openapi.ClientAutoConfigurationCodegen.Companion.CLIENT_AUTO_CONFIGURATION_GENERATOR_NAME
import org.gradle.api.Action
import org.gradle.api.Plugin
import org.gradle.api.Project
import org.gradle.api.Task
import org.gradle.api.artifacts.DependencyResolutionListener
import org.gradle.api.artifacts.ResolvableDependencies
import org.gradle.api.model.ObjectFactory
import org.gradle.api.plugins.JavaPluginExtension
import org.gradle.api.tasks.TaskProvider
import org.gradle.kotlin.dsl.create
import org.gradle.kotlin.dsl.getByType
import org.gradle.kotlin.dsl.newInstance
import org.gradle.kotlin.dsl.register
import org.jetbrains.kotlin.gradle.dsl.KotlinJvmProjectExtension
import org.openapitools.codegen.utils.CamelizeOption.UPPERCASE_FIRST_CHAR
import org.openapitools.codegen.utils.StringUtils.camelize
import org.openapitools.codegen.utils.StringUtils.underscore
import org.openapitools.generator.gradle.plugin.tasks.GenerateTask
import java.io.File
import javax.inject.Inject

class OpenApiPlugin : Plugin<Project> {
    override fun apply(project: Project) = project.run {
        with(pluginManager) {
            apply("java")
            apply("org.jetbrains.kotlin.jvm")
            apply("io.spring.dependency-management")
            apply("org.openapi.generator")
        }

        extensions.getByType<JavaPluginExtension>().sourceSets.named("main").configure {
            java.srcDir("$buildDir/generated/src/main/java")
            resources.srcDirs("$buildDir/generated/src/main/resources")
        }

        extensions.getByType<KotlinJvmProjectExtension>().sourceSets.named("main").configure {
            kotlin.srcDir("$buildDir/generated/src/main/kotlin")
        }

        val apiExtension = extensions.create<OpenApiExtension>(OpenApiExtension.NAME)

        afterEvaluate {
            if (apiExtension.serverApiSpecs.isNotEmpty()) {
                registerServerTask(apiExtension.serverApiSpecs)
            }
            if (apiExtension.clientConfigs.isNotEmpty()) {
                registerClientTask(apiExtension.clientConfigs)
            }
        }

        addDependencies(apiExtension)
    }

    private fun Project.addDependencies(extension: OpenApiExtension) {
        val versions = extensions.getByType<DependencyManagementExtension>().managedVersions
        val implementationDeps = configurations.getByName("implementation").dependencies
        gradle.addListener(object : DependencyResolutionListener {
            override fun beforeResolve(resolvableDependencies: ResolvableDependencies) {
                if (extension.serverApiSpecs.isNotEmpty()) {
                    implementationDeps.addAll(
                        SERVER_DEPENDENCIES.map { dependencies.create("$it:${versions[it]}") }
                    )
                }
                if (extension.clientConfigs.isNotEmpty()) {
                    implementationDeps.addAll(
                        CLIENT_DEPENDENCIES.map { dependencies.create("$it:${versions[it]}") }
                    )
                }
                gradle.removeListener(this)
            }

            override fun afterResolve(resolvableDependencies: ResolvableDependencies) {}
        })
    }

    private fun Project.registerServerTask(apiSpecs: Set<OpenApiSpecConfig>) {
        val generateSubTasks = apiSpecs.map {
            tasks.register<GenerateTask>("${it.path.name}-server") {
                generatorName.set("spring")
                inputSpec.set(it.path.absolutePath)
                outputDir.set("${buildDir}/generated")
                apiPackage.set(it.packageName)
                modelPackage.set("${it.packageName}.model")
                configOptions.set(
                    mapOf(
                        "useJakartaEe" to "true",
                        "interfaceOnly" to "true",
                        "exceptionHandler" to "false",
                        "gradleBuildFile" to "false",
                        "useTags" to "true"
                    )
                )
                templateDir.set("$rootDir/buildSrc/src/main/resources")
                additionalProperties.set(
                    mapOf(
                        "stringMinLength" to it.constraints.stringMinLength,
                        "stringMaxLength" to it.constraints.stringMaxLength,
                        "fileMinLength" to it.constraints.fileMinLength,
                        "fileMaxLength" to it.constraints.fileMaxLength
                    )
                )
            }
        }
        registerGenerateTask("generateServerApi", generateSubTasks)
    }

    private fun Project.registerClientTask(configs: Set<ClientConfig>) {
        configs.forEach { config ->
            val projectName = camelize(
                underscore(config.name),
                UPPERCASE_FIRST_CHAR
            )
            val generateSubTasks = config.specs.flatMap {
                listOf(
                    tasks.register<GenerateTask>("${config.name}-${it.path.name}-client") {
                        generatorName.set("java")
                        invokerPackage.set(it.packageName)
                        apiPackage.set(it.packageName)
                        modelPackage.set("${it.packageName}.model")
                        inputSpec.set(it.path.absolutePath)
                        outputDir.set("${buildDir}/generated")
                        generateApiTests.set(false)
                        generateModelTests.set(false)
                        configOptions.set(
                            mapOf(
                                "library" to "webclient",
                                "dateLibrary" to "java8",
                                "useJakartaEe" to "true",
                            )
                        )
                    },
                    tasks.register<GenerateTask>("${config.name}-${it.path.name}-autoconfiguration") {
                        generatorName.set(CLIENT_AUTO_CONFIGURATION_GENERATOR_NAME)
                        outputDir.set("${buildDir}/generated")
                        inputSpec.set(it.path.absolutePath)
                        apiPackage.set(it.packageName)
                        additionalProperties.set(
                            mapOf(
                                "projectName" to projectName
                            )
                        )
                    }
                )
            }

            registerGenerateTask("generate${projectName}ClientApi", generateSubTasks)
        }
    }

    private fun Project.registerGenerateTask(taskName: String, generateSubTasks: List<TaskProvider<GenerateTask>>) {
        tasks.register<Task>(taskName).also {
            it.configure {
                dependsOn(generateSubTasks)
            }
            tasks.named("compileKotlin") {
                dependsOn(it)
            }
            tasks.named("processResources") {
                dependsOn(it)
            }
        }
    }

    companion object {
        private val SERVER_DEPENDENCIES = listOf(
            "org.springframework.boot:spring-boot-starter-web",
            "org.springframework.boot:spring-boot-starter-validation",
            "org.springframework.data:spring-data-commons",
            "io.swagger.core.v3:swagger-annotations",
            "jakarta.xml.bind:jakarta.xml.bind-api",
            "com.fasterxml.jackson.datatype:jackson-datatype-jsr310",
            "org.openapitools:jackson-databind-nullable",
            "jakarta.validation:jakarta.validation-api",
            "com.fasterxml.jackson.core:jackson-databind",
        )

        private val CLIENT_DEPENDENCIES = listOf(
            "io.swagger.core.v3:swagger-annotations",
            "com.google.code.findbugs:jsr305",
            "io.projectreactor:reactor-core",
            "org.springframework.boot:spring-boot-starter-webflux",
            "io.projectreactor.netty:reactor-netty",
            "com.fasterxml.jackson.core:jackson-databind",
            "org.openapitools:jackson-databind-nullable",
            "com.fasterxml.jackson.datatype:jackson-datatype-jsr310",
            "jakarta.annotation:jakarta.annotation-api"
        )
    }
}

abstract class OpenApiExtension(private val objects: ObjectFactory) {
    companion object {
        const val NAME = "openApi"
    }

    val serverApiSpecs = mutableSetOf<OpenApiSpecConfig>()
    val clientConfigs = mutableSetOf<ClientConfig>()

    fun serverApiSpec(action: Action<OpenApiSpecConfig>) {
        serverApiSpecs.add(
            objects.newInstance<OpenApiSpecConfig>().also {
                action.execute(it)
            }
        )
    }

    fun clientApi(name: String, action: Action<ClientSpecs>) {
        clientConfigs.add(
            ClientConfig(
                name = name,
                specs = objects.newInstance<ClientSpecs>().also {
                    action.execute(it)
                }.specs
            )
        )
    }

    @Suppress("unused")
    fun constraints(action: Action<SpecConstraint>): SpecConstraint =
        objects.newInstance<SpecConstraint>().also {
            action.execute(it)
        }
}

abstract class OpenApiSpecConfig {
    abstract var path: File
    abstract var packageName: String
    var constraints: SpecConstraint = object : SpecConstraint() {}
}

abstract class SpecConstraint {
    var stringMinLength: Int = 1
    var stringMaxLength: Int = 255
    var fileMinLength: Int = 1
    var fileMaxLength: Int = 40 * 1024 * 1024
}

abstract class ClientSpecs @Inject constructor(private val objects: ObjectFactory) {
    val specs = mutableSetOf<OpenApiSpecConfig>()
    fun spec(action: Action<OpenApiSpecConfig>) {
        specs.add(
            objects.newInstance<OpenApiSpecConfig>().also {
                action.execute(it)
            }
        )
    }
}

class ClientConfig(
    var name: String,
    var specs: Set<OpenApiSpecConfig>
)
