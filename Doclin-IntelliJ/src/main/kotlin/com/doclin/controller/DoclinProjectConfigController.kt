package com.doclin.controller

import com.doclin.model.DoclinProjectConfig
import kotlinx.serialization.json.Json
import java.io.File

object DoclinProjectConfigController {

    private val json = Json { ignoreUnknownKeys = true } // Configure Json instance

    fun configToJson(config: DoclinProjectConfig): String {
        return json.encodeToString(DoclinProjectConfig.serializer(), config)
    }

    fun configFromJson(jsonString: String): DoclinProjectConfig? = try {
        json.decodeFromString(DoclinProjectConfig.serializer(), jsonString)
    } catch (e: Exception) {
        println("Error decoding JSON: ${e.message}")
        null
    }

    fun readConfigFromFile(filePath: String): DoclinProjectConfig? {
        return try {
            val file = File(filePath)
            if (file.exists()) {
                val jsonString = file.readText()
                configFromJson(jsonString)
            } else {
                println("Config file not found: $filePath")
                null
            }
        } catch (e: Exception) {
            println("Error reading config file: ${e.message}")
            null
        }
    }

    fun writeConfigToFile(config: DoclinProjectConfig, filePath: String): Boolean {
        return try {
            val jsonString = configToJson(config)
            File(filePath).writeText(jsonString)
            true
        } catch (e: Exception) {
            println("Error writing config file: ${e.message}")
            false
        }
    }
}