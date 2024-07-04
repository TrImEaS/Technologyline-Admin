import { NavLink } from "react-router-dom"
import { useState } from "react"
import page_icon from '../Assets/page-icon.jpeg'
import saleImg from '../Assets/hotsale-icon.svg'
import Swal from "sweetalert2"

export default function ProductCard({ product }) {
  const [imageError, setImageError] = useState(false)
  const [actualStatus, setActualStatus] = useState(product.adminStatus)
  const formattedPrice = parseFloat(product.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const formattedDiscount = parseFloat(product.discount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  
  const handleImageError = () => {
    setImageError(true)
  }
  
  const totalDiscount = (price, discount) => {
    // Convertir los precios a números
    const normalPrice = parseFloat(price);
    const discountedPrice = parseFloat(discount);
  
    // Calcular el porcentaje de descuento
    const percentage = ((normalPrice - discountedPrice) / normalPrice) * 100;
  
    // Devolver el porcentaje como un número entero
    return Math.round(percentage);
  }

  const percentageOff = totalDiscount(product.price, product.discount)

  const handleProductStatus = async (id) => {
    try 
    {
      Swal.fire
      ({
        title: 'Modificando producto...',
        html: 'Por favor espera...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      })

      const response = await fetch(`https://technologyline.com.ar/api/products/${id}`, 
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({adminStatus: !actualStatus})
      })

      if (!response.ok) 
      { 
        Swal.fire
        ({
          icon: 'error', 
          title: 'Error al modificar producto!',  
          text: 'Hubo un error al intentar modificar el producto.'
        });

        throw new Error('Error al editar producto') 
      }

      setActualStatus(!actualStatus)
      Swal.fire
      ({
        icon: 'success',
        title: 'Producto modificado correctamente!',
        showConfirmButton: false, 
        timer: 1500
      })
    } 
    catch (err) {
      console.log(err)
    }
  }
  
  return(
    <section className="flex box-border items-center justify-center bg-white px-1 py-4 w-full h-[200px]">
      <article className="flex w-full h-full border-r border-black px-1">
        <header className="relative w-full h-full box-border">
          {product.discount > 0 || product.discount
          ?
            <img className="absolute h-10 w-10 right-[25%] top-[-15px]" loading="eager" src={saleImg} alt="" />
          :
            ''
          }
          <img 
            src={imageError ? page_icon : product.img_base}
            alt={product.name}
            loading="eager" 
            className={`w-full h-full object-contain rounded-lg `}
            onError={handleImageError}
          />
        </header>

        <div className="w-full h-fit box-border flex flex-col justify-between">
          <p>{product.name}</p>
          {product.discount 
          ? 
          <div>
              <div className='flex items-center gap-x-1'>
                <p className="text-sm line-through">${formattedPrice}</p>
                <span className='text-sm mb-1 bg-orange-400 text-white px-2 rounded-full'>{percentageOff}% OFF</span>
              </div>
              <p className="font-bold text-2xl">${formattedDiscount}</p>
            </div>
          : 
          <p className="font-bold text-2xl">${formattedPrice}</p>
        }
        <p className="text-gray-600">SKU: <span>{product.sku}</span></p>
        <p className="text-gray-600">Stock: <span>{product.stock}</span></p>
        </div>
      </article>

      <article className="min-w-[200px] h-full border-l border-black px-1 font-bold">
        <ul className="flex flex-col gap-2">
          <NavLink 
            className='text-blue-700 hover:text-cyan-400 duration-300 w-10'
            to={`/admin/page/products/${product.sku}`}>
            Editar
          </NavLink>
          
          {actualStatus 
          ?
            <p onClick={() => handleProductStatus(product.id)} className="flex relative items-center h-5 gap-x-1 group cursor-pointer w-fit">
              <span className="text-green-500 group-hover:hidden flex">Activo</span>
              <span className="text-red-500 absolute hidden group-hover:flex">Desactivar</span>
            </p>
          : 
            <p onClick={() => handleProductStatus(product.id)} className="flex relative items-center h-5 gap-x-1 group cursor-pointer w-fit">
              <span className="text-red-500 group-hover:hidden flex">Desactivado</span>
              <span className="text-green-500 absolute hidden group-hover:flex">Activar</span>
            </p>
          }

          <p className="flex flex-col"> 
            <span className={`${!actualStatus || !product.status ? 'text-red-500' : 'text-green-500'}`}>
              Actualmente {!actualStatus || !product.status ? `Oculto` : `Visible`}
            </span>
            <span> ({product.stock < 3 ? 'Sin stock suficiente' : 'Con stock'})</span>
          </p>
        </ul>
      </article>
    </section>
  )
}