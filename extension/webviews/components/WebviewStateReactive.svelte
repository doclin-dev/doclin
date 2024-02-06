<script lang="ts">
    import { WebviewStateManager } from "../WebviewStateManager";
    import { WebviewStateType } from "../enums";
    import { activeTextEditor, activeView, currentOrganization, currentProject, githubUrl, page, replyContents, threadContents, threadSelected } from "./store";

    const setState = WebviewStateManager.setState;

    $: setState(WebviewStateType.PAGE, $page);

    $: setState(WebviewStateType.CURRENT_ORGANIZATION, $currentOrganization);

    $: setState(WebviewStateType.CURRENT_PROJECT, $currentProject);

    $: setState(WebviewStateType.THREAD_CONTENTS, $threadContents);

    $: setState(WebviewStateType.REPLY_CONTENTS, $replyContents);

    $: setState(WebviewStateType.THREAD_SELECTED, $threadSelected);

    $: setState(WebviewStateType.GITHUB_URL, $githubUrl);

    $: setState(WebviewStateType.ACTIVE_TEXT_EDITOR, $activeTextEditor);

    $: setState(WebviewStateType.ACTIVE_VIEW, $activeView);
</script>