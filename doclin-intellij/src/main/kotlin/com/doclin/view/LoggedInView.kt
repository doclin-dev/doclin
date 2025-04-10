package com.doclin.view

import com.doclin.controller.ThreadsController
import java.awt.GridLayout
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
        layout = GridLayout(5, 1, 5, 5)
        border = EmptyBorder(10, 10, 10, 10)

        val titlePanel = JPanel()
        titlePanel.layout = BoxLayout(titlePanel, BoxLayout.LINE_AXIS)
        val titleLabel = JLabel("Create new thread")
        titleLabel.font = titleLabel.font.deriveFont(java.awt.Font.BOLD, 16f)
        titlePanel.add(titleLabel)
        titlePanel.add(Box.createHorizontalGlue())
        add(titlePanel)

        val buttonsPanel = JPanel()
        buttonsPanel.layout = GridLayout(1, 2, 5, 0)
        buttonsPanel.add(allThreadsButton)
        buttonsPanel.add(fileThreadsButton)
        add(buttonsPanel)

        val messageScrollPane = JScrollPane(messageTextArea)
        add(messageScrollPane)

        val controlsPanel = JPanel()
        controlsPanel.layout = BoxLayout(controlsPanel, BoxLayout.LINE_AXIS)
        controlsPanel.add(anonymousCheckbox)
        controlsPanel.add(Box.createHorizontalGlue())
        controlsPanel.add(submitButton)
        add(controlsPanel)

        add(threadListView)

        allThreadsButton.addActionListener {
            threadListView.updateThreads(ThreadsController.getAllThreads())
        }
        fileThreadsButton.addActionListener {
            val filename = "example.txt"
            threadListView.updateThreads(ThreadsController.getFileThreads(filename))
        }
        submitButton.addActionListener {
            val message = messageTextArea.text
            ThreadsController.postThread(message)
            threadListView.updateThreads(ThreadsController.getAllThreads())
            messageTextArea.text = ""
        }
    }
}