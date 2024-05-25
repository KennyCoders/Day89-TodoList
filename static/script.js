$(function() {
    let draggedItem = null;

    $('#task-list').on('dragstart', 'li', function(e) {
        draggedItem = this;
        e.originalEvent.dataTransfer.effectAllowed = 'move';
        e.originalEvent.dataTransfer.setData('text/html', this.outerHTML);
    });

    $('#task-list').on('dragover', 'li', function(e) {
        e.preventDefault();
        e.originalEvent.dataTransfer.dropEffect = 'move';
        $(this).addClass('over');
    });

    $('#task-list').on('dragleave', 'li', function() {
        $(this).removeClass('over');
    });

    $('#task-list').on('drop', 'li', function(e) {
        e.preventDefault();
        $(this).removeClass('over');
        if (draggedItem !== this) {
            $(draggedItem).remove();
            const droppedHTML = e.originalEvent.dataTransfer.getData('text/html');
            $(this).before(droppedHTML);
            updateTaskOrder();
        }
    });

    function updateTaskOrder() {
        const taskOrder = [];
        $('#task-list li').each(function(index, element) {
            taskOrder.push($(element).data('id'));
        });

        $.ajax({
            url: '/reorder',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ tasks_order: taskOrder }),
            success: function(response) {
                if (response.success) {
                    console.log('Tasks reordered successfully');
                }
            }
        });
    }

    // Toggle edit fields
    $('#task-list').on('click', '.edit-btn', function() {
        const listItem = $(this).closest('li');
        listItem.find('.task-text, .edit-btn, .btn-danger').hide();
        listItem.find('.edit-input, .edit-save').show();
    });

    $('#task-list').on('click', '.edit-save', function() {
        const listItem = $(this).closest('li');
        listItem.find('.edit-input').hide();
        listItem.find('.edit-save').hide();
        listItem.find('.task-text, .edit-btn, .btn-danger').show();
    });
});
