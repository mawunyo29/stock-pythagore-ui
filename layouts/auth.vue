<script setup></script>
<template>
  <div class="bg-gray-50 w-full antialiased">
    <nav-header />
    <div class="flex overflow-hidden dark:bg-gray-900">
      <side-nav-bar />
      <div id="main-content"
        class="relative w-full h-full overflow-y-auto bg-gray-50  lg:ml-64 dark:bg-gray-900 overflow-auto top-7">
        <main class="min-h-screen w-full">
          <div>
            <slot />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
[sidebar-toggle-item] {
  transition: all 0.2s;
}

[sidebar-toggle-item]:hover {
  color: #4f46e5;
}

[sidebar-bottom-menu] {
  bottom: 0;
  left: 0;
}

[sidebar-bottom-menu] a {
  transition: all 0.2s;
}

[sidebar-bottom-menu] a:hover {
  color: #4f46e5;
}

[sidebar-bottom-menu] button {
  transition: all 0.2s;
}

[sidebar-bottom-menu] button:hover {
  color: #4f46e5;
}

[sidebar-bottom-menu] button svg {
  transition: all 0.2s;
}

[sidebar-bottom-menu] button:hover svg {
  fill: #4f46e5;
  transform: scale(1.1);
}

[sidebar-bottom-menu] [data-tooltip-target] {
  transition: all 0.2s;
}

[sidebar-bottom-menu] [data-tooltip-target]:hover {
  color: #4f46e5;
}

[sidebar-bottom-menu] [data-dropdown-toggle] {
  transition: all 0.2s;
}

[sidebar-bottom-menu] [data-dropdown-toggle]:hover {
  color: #4f46e5;
}

[sidebar-bottom-menu] [data-dropdown-toggle]:hover svg {
  fill: #4f46e5;
}

.open-container {
  transition: max-height 0.3s ease-out, padding 0.3s ease;
}
</style>
