<template>
  <div>
    <nav class="navbar fixed-top navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <img
            src="@/assets/MyChatBox_transparent.png"
            alt="MyChatBox Logo"
            width="200"
            class="d-inline-block align-top"
          />
        </a>

        <div class="d-flex ms-auto ">
          
          <router-link to="/" class="btn btn-outline-dark">Logout</router-link>
        </div>
      </div>
    </nav>
    <nav class="navbar navbar-light searchbar">
      <div class="container-fluid">
        <form class="d-flex mx-auto" style="width: 100%; max-width: 600px">
          <input
            class="form-control me-2 flex-grow-1"
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
          <button class="btn btn-outline-dark" type="submit">Search</button>
        </form>
      </div>
    </nav>

    
  </div>
</template>

<script></script>
<style>
.searchbar {
  margin-top: 90px;
  justify-content: center;
}
</style>
