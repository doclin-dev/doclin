<script lang="ts">
  import type { ProjectDTO } from '../../../../../../../shared/types/ProjectDTO';
  import type { PageData } from './$types';

  export let data: PageData;
  let project: ProjectDTO;

  $: project = data.project;
</script>

{project?.name}
