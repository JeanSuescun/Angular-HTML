import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../interfaces/producto.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  cargando = true;

  productos: Producto[] = [];

  productosFiltrado: Producto[] = [];

  constructor( private http: HttpClient) { 
    this.cargarProductos();

  }
  
  private cargarProductos(){
    return new Promise( (resolve, reject) => {
      this.http.get('https://angular-html-bfa18-default-rtdb.firebaseio.com/productos_idx.json')
        .subscribe( (resp: any ) => {
            console.log(resp);
            this.productos = resp;
            
            setTimeout(() => {
              this.cargando = false;
            }, 500);
            resolve(0);
    });

          });
  }

  getProducto( id: string){
    return this.http.get(`https://angular-html-bfa18-default-rtdb.firebaseio.com/productos/${ id }.json`)
  }

  buscarProducto( termino: string ) {
    
    if ( this.productos.length === 0 ) {
      //cargar productos
      this.cargarProductos().then( () => {
        //ejecutar despues de tener los productos
        //Aplicar filtro
        this.filtarProductos( termino );
      });
    }else{
      //aplicar el filtro
      this.filtarProductos( termino );
    }
  }

  private filtarProductos( termino: string ){
    console.log( this.productos);
    this.productosFiltrado = [];

    termino = termino.toLocaleLowerCase();

    this.productos.forEach( prod => {

      const tituloLower = prod.titulo.toLocaleLowerCase();
        if ( prod.categoria.indexOf( termino ) >= 0 || tituloLower.indexOf( termino ) >= 0 ){
        this.productosFiltrado.push( prod );
      }

    } );
  }
}
