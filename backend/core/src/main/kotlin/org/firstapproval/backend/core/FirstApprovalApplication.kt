package org.firstapproval.backend.core

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import java.util.TimeZone
import java.util.TimeZone.setDefault

@SpringBootApplication
class FirstApprovalApplication

fun main(args: Array<String>) {
    setDefault(TimeZone.getTimeZone("UTC"))
    runApplication<FirstApprovalApplication>(*args)
}
