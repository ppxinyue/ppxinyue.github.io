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

<div class="publications unpublished-projects">
  <h2 class="bibliography">Unpublished Projects</h2>
  <ol class="bibliography unpublished-project-list">
    <li>
      <div class="row">
        <div class="col col-sm-2 abbr unpublished-project-preview">
          <figure>
            <picture>
              <img
                src="{{ '/assets/img/project_preview/child-robot-interaction.png' | relative_url }}"
                class="preview z-depth-1 rounded"
                width="100%"
                height="auto"
                alt="Child-Robot Interaction project preview"
                data-zoomable
                loading="eager"
              />
            </picture>
          </figure>
        </div>
        <div id="child-robot-interaction" class="col-sm-8 unpublished-project-entry">
          <div class="title">Child-Robot Interaction</div>
        </div>
      </div>
    </li>
    <li>
      <div class="row">
        <div class="col col-sm-2 abbr unpublished-project-preview">
          <figure>
            <picture>
              <img
                src="{{ '/assets/img/project_preview/autism-clinical-interview.png' | relative_url }}"
                class="preview z-depth-1 rounded"
                width="100%"
                height="auto"
                alt="Autism Clinical Interview project preview"
                data-zoomable
                loading="eager"
              />
            </picture>
          </figure>
        </div>
        <div id="autism-clinical-interview" class="col-sm-8 unpublished-project-entry">
          <div class="title">Autism Clinical Interview</div>
        </div>
      </div>
    </li>
    <li>
      <div class="row">
        <div class="col col-sm-2 abbr unpublished-project-preview">
          <figure>
            <picture>
              <img
                src="{{ '/assets/img/project_preview/neuroeye-developmental-assessment.png' | relative_url }}"
                class="preview z-depth-1 rounded"
                width="100%"
                height="auto"
                alt="NeuroEye project preview"
                data-zoomable
                loading="eager"
              />
            </picture>
          </figure>
        </div>
        <div id="neuroeye-developmental-assessment" class="col-sm-8 unpublished-project-entry">
          <div class="title">NeuroEye: Machine Learning for Developmental Assessment</div>
        </div>
      </div>
    </li>
  </ol>
</div>

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
