package org.firstapproval.backend.core.config.security

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory
import org.springframework.core.annotation.AnnotatedElementUtils.findMergedAnnotation
import org.springframework.core.annotation.AnnotatedElementUtils.forAnnotations
import org.springframework.security.web.util.matcher.AntPathRequestMatcher
import org.springframework.web.bind.annotation.RequestMapping
import java.lang.reflect.Method

class ApiService(private val configurableListableBeanFactory: ConfigurableListableBeanFactory) {

    fun getAllPathsByScheme(scheme: String, caseSensitive: Boolean = true): Array<AntPathRequestMatcher> =
        getAllApiMethodsByScheme(scheme)
            .mapNotNull { findMergedAnnotation(forAnnotations(*it.annotations), RequestMapping::class.java) }
            .flatMap { requestMappingAnnotation ->
                requestMappingAnnotation.path.flatMap { path ->
                    requestMappingAnnotation.method.map {
                        AntPathRequestMatcher(path, it.name, caseSensitive)
                    }
                }
            }.toTypedArray()

    private fun getAllApiMethodsByScheme(scheme: String): List<Method> =
        getAllApiClasses().flatMap { it.methods.toList() }.filter {
            val securitySchemes = it.getAnnotation(Operation::class.java)?.security ?: arrayOf()
            securitySchemes.any { security -> security.name == scheme }
        }

    private fun getAllApiClasses(): List<Class<*>> {
        return configurableListableBeanFactory.getBeanNamesForAnnotation(Tag::class.java)
            .map { beanName -> configurableListableBeanFactory.getBeanDefinition(beanName).beanClassName }
            .flatMap { Class.forName(it).interfaces.toList() }
            .filter { it.isAnnotationPresent(Tag::class.java) }
    }
}
