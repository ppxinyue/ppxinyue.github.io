---
layout: page
permalink: /publications/
title: Publications
description: 期刊论文与会议发表
nav: true
nav_order: 4
---

<!-- _pages/publications.md -->

<!-- Bibsearch Feature -->

{% include bib_search.liquid %}

<div class="publications">

{% bibliography %}

</div>

<section class="unpublished-projects">
  <h2>Unpublished Projects</h2>
  <div class="unpublished-project-list">
    <article class="unpublished-project-item">
      <img src="{{ '/assets/img/project_preview/child-robot-interaction.png' | relative_url }}" alt="Child-Robot Interaction project preview" />
      <div>
        <h3>Child-Robot Interaction</h3>
      </div>
    </article>
    <article class="unpublished-project-item">
      <img src="{{ '/assets/img/project_preview/autism-clinical-interview.png' | relative_url }}" alt="Autism Clinical Interview project preview" />
      <div>
        <h3>Autism Clinical Interview</h3>
      </div>
    </article>
    <article class="unpublished-project-item">
      <img src="{{ '/assets/img/project_preview/neuroeye-developmental-assessment.png' | relative_url }}" alt="NeuroEye project preview" />
      <div>
        <h3>NeuroEye: Machine Learning for Developmental Assessment</h3>
      </div>
    </article>
  </div>
</section>

<div class="project-detail-overlay" id="project-detail-overlay" hidden aria-hidden="true">
  <div class="project-detail-backdrop" data-project-detail-close></div>
  <div class="project-detail-card" role="dialog">
    <button class="project-detail-close" type="button" data-project-detail-close aria-label="Close project detail">×</button>
    <form class="project-detail-form">
      <input id="project-detail-password" type="password" inputmode="numeric" autocomplete="off" placeholder="password" aria-label="password" />
      <button type="submit">open</button>
    </form>
  </div>
</div>

<script src="{{ '/assets/js/project-details.js' | relative_url }}"></script>
