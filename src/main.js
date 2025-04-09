import {render, RenderPosition} from './framework/render.js';
import HeaderComponent from './view/header-component.js';
import AddTaskComponent from './view/form-add-task-component.js';
import TaskBoardComponent from './view/board-task-component.js';
import TaskListComponent from './view/task-list-component.js';

const bodyContainer = document.querySelector('body');
const mainContainer = document.createElement('main');
mainContainer.classList.add('container');
bodyContainer.append(mainContainer);


render(new HeaderComponent(), bodyContainer, RenderPosition.BEFOREBEGIN);
render(new AddTaskComponent(), mainContainer);


const taskBoardComponent = new TaskBoardComponent();
render(taskBoardComponent, mainContainer);


const lists = [
  {type: 'backlog', title: 'Бэклог', tasks: ['Выучить JS', 'Выучить React', 'Сделать домашку']},
  {type: 'in-progress', title: 'В процессе', tasks: ['Заплатить кварплату', 'Помыть машину']},
  {type: 'done', title: 'Готово', tasks: ['Позвонить маме', 'Поговорить с другом']},
  {type: 'trash', title: 'Корзина', tasks: ['Сходить в магазин', 'Прочитать Достоевского'], hasButton: true}
];


lists.forEach(list => {
  const listComponent = new TaskListComponent(list);
  render(listComponent, taskBoardComponent.getElement());
});
