package com.github.yhk1038.claudecodegui.toolwindow

import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test

class IsExternalWebUrlTest {

    @Test
    fun `https page on another host is external`() {
        assertTrue(isExternalWebUrl("https://bitbucket.org/org/repo/pull-requests/71"))
    }

    @Test
    fun `http page on another host is external`() {
        assertTrue(isExternalWebUrl("http://jira.example.com/browse/REB-1"))
    }

    @Test
    fun `our own localhost UI is not external`() {
        assertFalse(isExternalWebUrl("http://localhost:34957/sessions/new?workingDir=%2Ftmp"))
        assertFalse(isExternalWebUrl("http://127.0.0.1:34957/settings/general"))
    }

    @Test
    fun `non-web schemes are not external`() {
        assertFalse(isExternalWebUrl("file:///home/me/pic.png"))
        assertFalse(isExternalWebUrl("about:blank"))
        assertFalse(isExternalWebUrl("devtools://devtools/bundled/inspector.html"))
    }

    @Test
    fun `unparsable input is not external`() {
        assertFalse(isExternalWebUrl("not a url"))
        assertFalse(isExternalWebUrl(""))
    }
}
