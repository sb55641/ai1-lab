class Todo {
    constructor(list, search, task, date, add) {
        this.list = list;
        this.search = search;
        this.task = task;
        this.date = date;
        this.add = add;
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.add.addEventListener('click', () => this.addT());
        this.search.addEventListener('input', () => this.draw());
        this.draw();
    }

    addT() {
        const text = this.task.value.trim();
        const date = this.date.value;

        if (text.length < 3 || text.length > 255) {
            alert('Task must be between 3 and 255 characters.');
            return;
        }
       if (date && new Date(date) <= new Date()) {
            alert('Date must be in the future.');
            return;
        }
        this.tasks.push({ text, date });
        this.save();
        this.draw();
        this.task.value = '';
        this.date.value = '';
    }

    delete(index) {
        this.tasks.splice(index, 1);
        this.save();
        this.draw();
    }

    edit(index, taskDiv) {
        taskDiv.innerHTML = '';

        const inputText = document.createElement('input');
        inputText.type = 'text';
        inputText.value = this.tasks[index].text;
        taskDiv.classList.add('task-editing');

        const inputDate = document.createElement('input');
        inputDate.type = 'date';
        inputDate.value = this.tasks[index].date || '';

        taskDiv.appendChild(inputText);
        taskDiv.appendChild(inputDate);
        inputText.focus();

        const saveEdit = () => {
            const newText = inputText.value.trim();
            const newDate = inputDate.value;

            if (newText.length < 3 || newText.length > 255) {
                alert('Task must be 3-255 chars.');
                this.draw();
                document.removeEventListener('click', outsideClick);
                return;
            }

            if (newDate && new Date(newDate) <= new Date()) {
                alert('Date must be in the future.');
                this.draw();
                document.removeEventListener('click', outsideClick);
                return;
            }

            this.tasks[index] = { text: newText, date: newDate || '' };
            this.save();
            this.draw();
            document.removeEventListener('click', outsideClick);
        };

        const outsideClick = (e) => {
            if (!taskDiv.contains(e.target)) saveEdit();
        };

        setTimeout(() => document.addEventListener('click', outsideClick), 0);
    }

    save() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    draw() {
        this.list.innerHTML = '';
        const filter = this.search.value.trim().toLowerCase();

        this.tasks.forEach((task, i) => {
            if (filter.length >= 2 && !task.text.toLowerCase().includes(filter)){
                return;
            } 
            const taskDiv = document.createElement('div');
            taskDiv.classList.add('task'); 

            const textSpan = document.createElement('span');
            textSpan.classList.add('text');
            if (filter.length >= 2) {
                const regex = new RegExp(`(${filter})`, 'gi');
                textSpan.innerHTML = task.text.replace(regex, '<mark>$1</mark>');
            } else {
                textSpan.textContent = task.text;
            }

            textSpan.addEventListener('click', () => this.edit(i, taskDiv));

            const dateSpan = document.createElement('span');
            if (task.date) {
                dateSpan.textContent = task.date.split('-').reverse().join('.');
            } else {
                dateSpan.textContent = '';
            }
            dateSpan.classList.add('date'); 

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = () => this.delete(i);

            taskDiv.appendChild(textSpan);
            taskDiv.appendChild(dateSpan);
            taskDiv.appendChild(deleteBtn);

            this.list.appendChild(taskDiv);
        });
    }
}

const todo = new Todo(
    document.getElementById('list'),
    document.getElementById('search'),
    document.getElementById('task'),
    document.getElementById('date'),
    document.getElementById('add')
);
