package com.doclin

import com.doclin.view.DoclinStartView
import com.intellij.openapi.project.DumbAware
import com.intellij.openapi.project.Project
import com.intellij.openapi.wm.ToolWindow
import com.intellij.openapi.wm.ToolWindowFactory
import com.intellij.ui.content.ContentFactory

class DoclinMain : ToolWindowFactory, DumbAware {
    init {
        // Plugin initialization logic that doesn't require project access goes here.
        println("DoclinMain initialized")
    }

    override fun createToolWindowContent(project: Project, toolWindow: ToolWindow) {
        val doclinStartView = DoclinStartView()
        val content = ContentFactory.getInstance().createContent(doclinStartView, "", false)
        toolWindow.contentManager.addContent(content)

        // Example: Accessing project and toolwindow after creation (Still present for demonstration)
        println("Project Name: ${project.name}")
        println("Tool Window ID: ${toolWindow.id}")
    }

    override fun shouldBeAvailable(project: Project): Boolean = true
}