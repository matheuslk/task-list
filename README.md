# 📓 TaskList

### Manage all of your tasks in one place

#### Written with:

<div style="
  display: flex;
  column-gap: 12px;
">
  <img src="https://user-images.githubusercontent.com/25181517/183890595-779a7e64-3f43-4634-bad2-eceef4e80268.png" height="36px"/>
  <img src="https://user-images.githubusercontent.com/25181517/183890598-19a0ac2d-e88a-4005-a8df-1ee36782fde1.png" height="36px"/>
  <img src="https://v8.ngrx.io/assets/images/badge.svg" height="36px"/>
</div>

## Features (work in progress...)

- #### ✅ Search
- #### ✅ Change list color to give it an additional meaning
- #### ✅ Pin the most important lists
- #### ❌ Create, update and delete lists and it´s relative tasks
- #### ❌ Organize list order moving it with drag-and-drop

## Installation

```bash
npm install
```

## Usage

```bash
npm start
```

## Configuration

In this project i´m using Browser LocalStorage to store the data, as i´m focusing only in the Frontend now. The project is started with some lists and tasks mocks, but you can configure it in **task-list.service.ts** and **task.service.ts** in it´s **load()** methods.
