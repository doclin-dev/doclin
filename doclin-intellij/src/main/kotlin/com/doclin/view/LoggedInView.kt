package com.doclin.view

import com.intellij.openapi.project.ProjectManager
import com.doclin.controller.ThreadsController
import com.doclin.utils.FileUtils
import java.awt.Component
import java.awt.Dimension
import javax.swing.*
import javax.swing.border.EmptyBorder

class LoggedInView : JPanel() {

    private val messageTextArea = JTextArea(5, 20)
    private val anonymousCheckbox = JCheckBox("Post as an anonymous user")
    private val submitButton = JButton("Submit")
    private val allThreadsButton = JButton("All Threads")
    private val fileThreadsButton = JButton("File Threads")
    private val threadListView = ThreadListView()

    init {
        layout = BoxLayout(this, BoxLayout.Y_AXIS)
        border = EmptyBorder(10, 10, 10, 10)
        alignmentX = Component.LEFT_ALIGNMENT

        val titlePanel = JPanel()
        titlePanel.layout = BoxLayout(titlePanel, BoxLayout.LINE_AXIS)
        val titleLabel = JLabel("Create new thread")
        titleLabel.font = titleLabel.font.deriveFont(java.awt.Font.BOLD, 16f)
        titlePanel.add(titleLabel)
        titlePanel.add(Box.createHorizontalGlue())
        titlePanel.alignmentX = Component.LEFT_ALIGNMENT
        add(titlePanel)

        val buttonsPanel = JPanel()
        buttonsPanel.layout = BoxLayout(buttonsPanel, BoxLayout.LINE_AXIS)
        buttonsPanel.add(allThreadsButton)
        buttonsPanel.add(fileThreadsButton)
        buttonsPanel.alignmentX = Component.LEFT_ALIGNMENT
        add(buttonsPanel)

        val messageScrollPane = JScrollPane(messageTextArea)
        messageScrollPane.maximumSize = Dimension(Short.MAX_VALUE.toInt(), messageScrollPane.preferredSize.height * 2)
        messageScrollPane.alignmentX = Component.LEFT_ALIGNMENT
        add(messageScrollPane)

        val controlsPanel = JPanel()
        controlsPanel.layout = BoxLayout(controlsPanel, BoxLayout.LINE_AXIS)
        controlsPanel.alignmentX = Component.LEFT_ALIGNMENT
        controlsPanel.add(anonymousCheckbox)
        controlsPanel.add(Box.createHorizontalGlue())
        controlsPanel.add(submitButton)
        add(controlsPanel)

        threadListView.alignmentX = Component.LEFT_ALIGNMENT
        add(threadListView)

        threadListView.updateThreads(ThreadsController.getAllThreads())

        allThreadsButton.addActionListener {
            threadListView.updateThreads(ThreadsController.getAllThreads())
        }
        fileThreadsButton.addActionListener {
            val currentProject = ProjectManager.getInstance().openProjects.firstOrNull()
            val currentFileName = FileUtils.getCurrentOpenedFileName(currentProject)
            if (currentFileName != null) {
                println("Displaying file threads for: $currentFileName") // Print the file name
                threadListView.updateThreads(ThreadsController.getFileThreads(currentFileName))
            } else {
                println("No file is currently open.") // Indicate when no file is open
                threadListView.updateThreads(emptyList())
            }
        }
        submitButton.addActionListener {
            val message = messageTextArea.text
            ThreadsController.postThread(message)
            threadListView.updateThreads(ThreadsController.getAllThreads())
            messageTextArea.text = ""
        }
    }
}