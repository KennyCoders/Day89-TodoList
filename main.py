from flask import Flask, render_template, request, redirect, url_for, jsonify
from datetime import datetime

app = Flask(__name__)

# In-memory lists to store tasks and completed tasks
tasks = []
completed_tasks = []

@app.route('/')
def index():
    return render_template('index.html', tasks=tasks, completed_tasks=completed_tasks)

@app.route('/add', methods=['POST'])
def add_task():
    task = request.form.get('task')
    priority = request.form.get('priority')
    timestamp = datetime.now().strftime("%H:%M - %m/%d")
    if task and priority:
        tasks.append({'task': task, 'priority': priority, 'timestamp': timestamp})
    return redirect(url_for('index'))

@app.route('/delete/<int:task_id>')
def delete_task(task_id):
    if 0 <= task_id < len(tasks):
        del tasks[task_id]
    return redirect(url_for('index'))

@app.route('/complete/<int:task_id>')
def complete_task(task_id):
    if 0 <= task_id < len(tasks):
        completed_tasks.append(tasks.pop(task_id))
    return redirect(url_for('index'))


@app.route('/edit/<int:task_id>', methods=['POST'])
def edit_task(task_id):
    new_task_text = request.form.get('task')
    if new_task_text and 0 <= task_id < len(tasks):
        tasks[task_id]['task'] = new_task_text
    return redirect(url_for('index'))

@app.route('/reorder', methods=['POST'])
def reorder_tasks():
    global tasks
    tasks_order = request.json['tasks_order']
    tasks = [tasks[i] for i in tasks_order]
    return jsonify(success=True)

if __name__ == '__main__':
    app.run(debug=True)
