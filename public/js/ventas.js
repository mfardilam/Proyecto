//Vue --> funcion framework view
const app = Vue.createApp({
    template: `
      <checkout />
    `
  });
  // top form
  app.component('checkout', {
    data(){
      return {
        term: ``,
        foundCustomer: {},
        successiveNumber: 1,
      }
    },
    created(){
    },
    methods: {
      onInput(e){
        console.log(e.target.value);
        this.term = e.target.value;
      },
      onUpdateSuccessive(successive){
        this.term = '';
        this.foundCustomer = {};
        this.successiveNumber = successive;
      },
      async onSearchItem(){
        try {
          const response = await fetch('/ventas/search/customer?term=' + this.term);
          //console.log(response)
          const data = await response.json();
          console.log(data);
          if(data){
            this.foundCustomer = data;
          }
          else{
            this.foundCustomer = {};
            alert('Cliente no encontrado');
          }
        } catch (error) {
          console.log(error);
        }
  
      }
    },
    template: `
    <div class="row">
      <div class="col-12 mb-5">
        <form class="row">
          <div class="col-auto">
            <label>Cédula</label>
          </div>
          <div class="col-auto">
            <input type="text" class="form-control" :value="term" @input="onInput">
          </div>
          <div class="col-auto">
            <button type="button" class="btn btn-primary btn-sm" @click="onSearchItem">Consultar</button>
          </div>
          <div class="col-auto">
            <label>Cliente</label>
          </div>
          <div class="col-auto">
            <input type="text" class="form-control" :value="foundCustomer.name" readonly>
          </div>
          <div class="col-auto">
            <label>Consec.</label>
          </div>
          <div class="col-auto">
            <input type="text" class="form-control" :value="successiveNumber" readonly>
          </div>
        </form>
      </div>
      <div class="col-12">
        <items :customer="foundCustomer" :on-update-successive="onUpdateSuccessive" :successive-number="successiveNumber"/>
      </div>
    </div>
    `
  });
  
  // checkout container
  app.component('items', {
    props: ['customer', 'successive-number', 'on-update-successive'],
    data(){
      return {
        items: [],
        iva: .19
      }
    },
    computed: {
      filteredItems(){
        return this.items.filter( item => item.isDelete !== true );
      },
      itemsTotal(){
        return this.filteredItems.reduce((a, b) => a + b.total, 0) || 0;
      },
      itemsIva(){
        const totalAmount = this.filteredItems.reduce((a, b) => a + b.total, 0) || 0;
        return parseFloat(totalAmount * this.iva).toFixed(2);
      },
      total(){
        const totalAmount = this.filteredItems.reduce((a, b) => a + b.total, 0) || 0;
        return parseFloat(parseInt(totalAmount) + (totalAmount * this.iva)).toFixed(2);
      }
    },
    methods: {
      addItem(){
        //console.log(this.items);
        this.items.push({ isDelete: false });
        console.log(this.items.length);
      },
      deleteItem(item){
        //const items = this.items.filter( (item, i) => item !== i );
        item.id = null;
        item.code = '';
        item.name = '';
        item.cost = '';
        item.qty = '';
        item.total = '';
        item.isDelete = true;
        //this.items.filter( (item, i) => i !== index );
        //console.log(this.filteredItems());
        //this.items = items;
      },
      async onSearchItem(item){
        try {
          const response = await fetch('/ventas/search/item?term=' + (item.term || ''));
          const data = await response.json();
  
          if(data){
            const found = this.filteredItems.find( item => item.code === data.code );
            if(found){
              alert('Producto ya existente')
              return;
            }
  
            item.id = data.id;
            item.name = data.name;
            item.code = data.code;
            item.cost = data.cost;
            item.qty = 1;
            item.total = item.qty * data.cost;
          }
          else{
            alert('Producto no encontrado');
            item.id = null;
            item.code = item.term;
            item.name = '';
            item.cost = '';
            item.qty = '';
            item.total = '';
          }
          //console.log(item);
        } catch (error) {
          console.log(error);
        }
      },
      onInputItem(e, item){
        const term = e.target.value
        item.term = term;
        console.log(item.term);
      },
      onInputQty(e, item){
        if(!item.cost){
          return;
        }
  
        const qty = e.target.value;
  
        if(!isNaN(qty)){
          item.qty = qty ? parseInt(qty) : '';
          item.total = qty ? parseInt(qty) * item.cost : '';
          console.log(item.cost);
        }
      },
      async confirm(){
        if(this.customer.id === undefined || !this.customer.id){
          alert('Agregue un cliente para confirmar');
          return;
        }
        if(this.items.length === 0){
          alert('Agregue un producto para confirmar');
          return;
        }
        for (const item of this.filteredItems) {
          if(item.id === undefined || item.id === null){
            alert('Busque el codigo correcto del producto');
            return;
          }
  
          if(item.qty === undefined || !item.qty){
            alert('Agregue una cantida valida del producto');
            return;
          }
          //console.log(item.id === undefined || item.id === null);
        }
        const post = {
          client_id: this.customer.id,
          items: this.items,
          sub_total: this.itemsTotal,
          iva: this.itemsIva,
          total: this.total,
        }
  
        const response = await fetch('/ventas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(post),
        })
        const data = await response.json();
        alert(data.msg)
        this.onUpdateSuccessive(data.successive);
        this.items.length = 0;
        //this.items.length = 0;
      }
    },
    template: `
        <div class="row mb-2">
          <div class="col">
            <button
              type="button"
              class="btn btn-primary btn-sm"
              @click="addItem"
            >
              Agrega producto
            </button>
          </div>
        </div>
        <div
          class="row mb-3"
          v-for="(item, i) in filteredItems"
          :key="i"
        >
          <div class="col-4">
            <label :class="[ i > 0 ? 'visually-hidden' : '' ]">Cod. Producto</label>
            <div class="row g-0">
              <div class="col-8">
                <input type="text" class="form-control" @input="onInputItem($event, item)" :value="item.code || ''">
              </div>
              <div class="col-4 text-center">
                <button
                  type="button"
                  class="btn btn-primary btn-sm"
                  @click="onSearchItem(item)"
                >
                  Consultar
                </button>
              </div>
            </div>
          </div>
          <div class="col-3">
            <label :class="[ i > 0 ? 'visually-hidden' : '' ]">Nombre Producto</label>
            <input type="text" class="form-control" :value="item.name" readonly>
          </div>
          <div class="col-1">
            <label :class="[ i > 0 ? 'visually-hidden' : '' ]">Cant.</label>
            <input type="text" class="form-control" :value="item.qty" @input="onInputQty($event, item)">
          </div>
          <div class="col-2">
            <label :class="[ i > 0 ? 'visually-hidden' : '' ]">Vlr. Total</label>
            <input type="text" class="form-control" :value="item.total" readonly>
          </div>
          <div class="col-1">
            <label :class="[ i > 0 ? 'visually-hidden' : '' ]"></label>
            <div class="row g-0">
              <div class="col">
                <button
                  type="button"
                  class="btn btn-danger btn-sm"
                  @click="deleteItem(item)"
                >
                  Borrar
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-6 my-auto text-center">
          <button
            type="button"
            class="btn btn-primary btn-sm"
            @click="confirm"
          >
            Confirmar
          </button>
          </div>
          <div class="col-4">
            <div class="row mb-3">
              <div class="col-6 text-center">
                <label>Subtotal</label>
              </div>
              <div class="col-6">
                <input type="text" class="form-control" :value="itemsTotal" readonly>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-6 text-center">
                <label>Total IVA</label>
              </div>
              <div class="col-6">
                <input type="text" class="form-control" :value="itemsIva" readonly>
              </div>
            </div>
            <div class="row mb-3 text-center">
              <div class="col-6">
                <label>Total con IVA</label>
              </div>
              <div class="col-6">
                <input type="text" class="form-control" :value="total" readonly>
              </div>
            </div>
          </div>
        </div>
    `
  })
  
  // app.component('item', {
  //   props: ['item']
  // });
  
  app.mount('#app');