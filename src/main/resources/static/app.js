// app.js
// Place under src/main/resources/static/app.js
(function() {
  var API = '/api/products'; // adjust if your API path differs
  var productModalEl = document.getElementById('productModal');
  var productModal = new bootstrap.Modal(productModalEl, { backdrop: 'static' });
  var form = document.getElementById('productForm');

  // helpers to get fields
  function $id(id) { return document.getElementById(id); }

  // load list on startup
  window.addEventListener('load', function() {
    loadAll();
    document.getElementById('btnAdd').addEventListener('click', openAdd);
    form.addEventListener('submit', saveProduct);
  });

  function showEmptyState(show) {
    document.getElementById('emptyState').style.display = show ? 'block' : 'none';
  }

  function loadAll() {
    fetch(API)
      .then(function(r){ return r.json(); })
      .then(function(list){
        renderTable(list);
      })
      .catch(function(e){
        console.error('Failed to load products:', e);
        renderTable([]);
      });
  }

  function renderTable(list) {
    var tbody = document.getElementById('productsTbody');
    tbody.innerHTML = '';
    if (!list || list.length === 0) {
      showEmptyState(true);
      return;
    }
    showEmptyState(false);

    for (var i = 0; i < list.length; i++) {
      (function(p) {
        var tr = document.createElement('tr');

        var tdId = document.createElement('td'); tdId.textContent = p.id; tr.appendChild(tdId);
        var tdName = document.createElement('td'); tdName.textContent = p.name; tr.appendChild(tdName);
        var tdDesc = document.createElement('td'); tdDesc.textContent = p.description || ''; tr.appendChild(tdDesc);

        var tdPrice = document.createElement('td');
        tdPrice.className = 'text-end';
        tdPrice.textContent = (p.price === undefined || p.price === null) ? '-' : Number(p.price).toFixed(2);
        tr.appendChild(tdPrice);

        var tdActions = document.createElement('td');
        tdActions.className = 'text-center';

        var editBtn = document.createElement('button');
        editBtn.className = 'btn btn-sm btn-outline-primary me-2';
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', function(){ openEdit(p.id); });
        tdActions.appendChild(editBtn);

        var delBtn = document.createElement('button');
        delBtn.className = 'btn btn-sm btn-outline-danger';
        delBtn.textContent = 'Delete';
        delBtn.addEventListener('click', function(){ deleteProduct(p.id); });
        tdActions.appendChild(delBtn);

        tr.appendChild(tdActions);
        tbody.appendChild(tr);
      })(list[i]);
    }
  }

  function openAdd() {
    $id('modalTitle').textContent = 'Add Product';
    $id('productId').value = '';
    $id('name').value = '';
    $id('description').value = '';
    $id('price').value = '';
    clearValidation();
    productModal.show();
  }

  function openEdit(id) {
    fetch(API + '/' + id)
      .then(function(r){
        if (r.status === 200) return r.json();
        throw new Error('Not found');
      })
      .then(function(p){
        $id('modalTitle').textContent = 'Edit Product';
        $id('productId').value = p.id;
        $id('name').value = p.name || '';
        $id('description').value = p.description || '';
        $id('price').value = (p.price == null) ? '' : p.price;
        clearValidation();
        productModal.show();
      })
      .catch(function(e){
        alert('Product not found.');
      });
  }

  function saveProduct(evt) {
    evt.preventDefault();
    if (!validateForm()) return;

    var id = $id('productId').value;
    var dto = {
      name: $id('name').value.trim(),
      description: $id('description').value.trim(),
      price: parseFloat($id('price').value)
    };

    var url = API;
    var method = 'POST';
    if (id) {
      url = API + '/' + id;
      method = 'PUT';
    }

    $id('saveBtn').disabled = true;
    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto)
    })
    .then(function(resp){
      $id('saveBtn').disabled = false;
      if (resp.ok) {
        productModal.hide();
        loadAll();
      } else {
        return resp.json().then(function(err){ throw err; });
      }
    })
    .catch(function(err){
      console.error('Save failed', err);
      alert('Save failed. See console for details.');
      $id('saveBtn').disabled = false;
    });
  }

  function deleteProduct(id) {
    if (!confirm('Delete product #' + id + ' ?')) return;
    fetch(API + '/' + id, { method: 'DELETE' })
      .then(function(r){
        if (r.status === 204 || r.ok) {
          loadAll();
        } else {
          throw new Error('Delete failed');
        }
      })
      .catch(function(e){
        console.error('Delete failed', e);
        alert('Delete failed. See console.');
      });
  }

  // simple validation using browser API + custom checks
  function validateForm() {
    var name = $id('name');
    var price = $id('price');

    clearValidation();

    var ok = true;
    if (!name.value.trim()) {
      name.classList.add('is-invalid');
      ok = false;
    }
    if (price.value.trim() === '' || isNaN(Number(price.value))) {
      price.classList.add('is-invalid');
      ok = false;
    }
    return ok;
  }

  function clearValidation() {
    var els = form.querySelectorAll('.is-invalid');
    for (var i = 0; i < els.length; i++) {
      els[i].classList.remove('is-invalid');
    }
  }
})();
