import { useEffect, useState } from "react";
import BackOffice from "../../components/Backoffice";
import axios from "axios";
import Swal from "sweetalert2";
import config from "../../config";
import dayjs from "dayjs";
import Mymodal from "../../components/Mymodal";

function BillSale(){
    const [billSales, setBillSales] = useState([]);
    const [billSaleDetails, setBillSaleDetails] = useState([]);
    const [sumPrice, setSumPrice] = useState(0);
    useEffect(() => {
        fetchData();
    },[]);
    const  fetchData = async () => {
        try {
            const res = await axios.get(config.apiPath + '/api/sale/list', config.headers());
            if (res.data.results !== undefined) {
                setBillSales(res.data.results);
            }
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }
    const openModalInfo = async (item) =>{
        try {
         const res = await axios.get(config.apiPath + '/api/sale/billInfo/' + item.id, config.headers());

         if (res.data.results !== undefined) {
           setBillSaleDetails(res.data.results);

           let mySumprice = 0;
           for (let i = 0; i < res.data.results.length; i++) {
                mySumprice += parseInt(res.data.results[i].price);
         }
         setSumPrice(mySumprice);
         }
        } catch (e) {
            Swal.fire({
                title:"error",
                text: 'e.message',
                icon: 'error'
            })
        }

    }
    const handlePay = async (item) =>{
        try {
            const button = await Swal.fire({
                title: 'ยืนยันการชําระเงิน',
                text: 'คุณได้รับการชำระเงินและตรวจสอบการชำระเงินเรียบร้อยแล้ว',
                icon: 'question',
                showCancelButton: true,
                showConfirmButton: true,
            });
            if (button.isConfirmed) {
                const res = await axios.get(config.apiPath + '/api/sale/updateStatusToPay/' + item.id, config.headers());
                if (res.data.message === 'success') {
                    Swal.fire({
                        title: 'Save',
                        text: 'บันทึุก์ข้อมูลเรียบร้อยแล้ว',
                        icon: 'success',
                        timer: 1000
                    })
                    fetchData();
                }
            }
       
        } catch (e) {
            Swal.fire({
                title :"error",
                text: e.message,
                icon: 'error'
            })
        }
    };
    const handleSend = async (item) =>{
        try {
            const button = await Swal.fire({
                title: 'ยืนยันการจัดส่งสินค้า',
                text: 'คุณต้องการบันทึกว่าจัดส่งสินค้าแล้ว',
                icon: 'question',
                showCancelButton: true,
                showConfirmButton: true,
            });
            if (button.isConfirmed) {
                const res = await axios.get(config.apiPath + '/api/sale/updateStatusToSend/' + item.id, config.headers());
                if (res.data.message === 'success') {
                    Swal.fire({
                        title: 'Save',
                        text: 'บันทึุก์ข้อมูลเรียบร้อยแล้ว',
                        icon: 'success',
                        timer: 1000
                    })
                    fetchData();
                }
            }
       
        } catch (e) {
            Swal.fire({
                title :"error",
                text: e.message,
                icon: 'error'
            })
        }
    }
    const handleCancel = async (item) =>{
        try {
            const button = await Swal.fire({
                title: 'ยืนยันการยกเลิกสินค้า',
                text: 'คุณต้องการบันทึกว่ายกเลิกสินค้าแล้ว',
                icon: 'question',
                showCancelButton: true,
                showConfirmButton: true,
            });
            if (button.isConfirmed) {
                const res = await axios.get(config.apiPath + '/api/sale/updateStatusToCancel/' + item.id, config.headers());
                if (res.data.message === 'success') {
                    Swal.fire({
                        title: 'Save',
                        text: 'บันทึุก์ข้อมูลเรียบร้อยแล้ว',
                        icon: 'success',
                        timer: 1000
                    })
                    fetchData();
                }
            }
       
        } catch (e) {
            Swal.fire({
                title :"error",
                text: e.message,
                icon: 'error'
            })
        }
    }
    const displayStatusText = (item) =>{
        if (item.status === 'pay') {
            return <div className="badge bg-success">ชำระเงินแล้ว</div>
        } else if (item.status === 'send') {
            return <div className="badge bg-info">จัดส่งแล้ว</div>
        } else if (item.status === 'cancel') {
            return <div className="badge bg-danger">ยกเลิกรายการ</div>
        } else if (item.status === 'wait') {
            return <div className="badge bg-warning">รอชำระเงิน</div>
        }
        
    
    }
    return<BackOffice>
        <div className="card">
            <div className="card-header">
                <div className="card-title "> รายงานยอดขาย</div>
            </div>
            <div className="card-body">
            <table className="table table-bordered table-striped">
    <thead>
        <tr>
            <th>ลูกค้า</th>
            <th>เบอร์โทร</th>
            <th>ที่อยู่</th>
            <th>วันที่ชำระเงิน</th>
            <th>เวลา</th>
            <th>สถานะ</th>
            <th width='490px'></th>
        </tr>
    </thead>
    <tbody>
        {billSales.length > 0 ? billSales.map(item =>
        <tr key={item.id}>
            <td>{item.customerName}</td> 
            <td>{item.customerPhone}</td> 
            <td>{item.customerAddress}</td> 
            <td>{dayjs(item.payDate).format('DD/MM/YYYY')}</td> 
            <td>{item.payTime}</td> 
            <td>{displayStatusText(item)}</td>
            <td className="text-center">
            
                    <button className="btn btn-secondary mr-1" 
                    data-toggle="modal" data-target="#modalInfo" 
                    onClick={e => openModalInfo(item)}>
                        <i className="fa fa-file-alt  mr-2"></i> รายการ
                    </button>
                    <button className="btn btn-info mr-1" 
                     onClick={e => handlePay(item)}>
                        <i className="fa fa-check  mr-2"></i>ได้รับชำระแล้ว
                    </button>
                    <button className="btn btn-success mr-1" 
                    onClick={e => handleSend(item)}>
                        <i className="fa fa-file  mr-2"></i>จัดส่งแล้ว
                    </button>
                    <button className="btn btn-danger mr-1"  
                    onClick={e => handleCancel(item)}>
                        <i className="fa fa-trash mr-2 "></i>ยกเลิก
                    </button>
            
            </td> 
        </tr>
        ) : <></>}
    </tbody>
</table>

            </div>
        </div>
        <Mymodal id="modalInfo" title="รายการของบิล">
            <table className=" table table-bordered table-striped">
                <thead>
                    <tr>
                        <th>รายการสินค้า</th>
                        <th className="text-right">ราคา</th>
                        <th className="text-right">จำนวน</th>
                       
                    </tr>
                </thead>
                <tbody>
                    {billSaleDetails.length > 0 ? billSaleDetails.map(item =>
                    <tr key={item.id}>
                        <td>{item.Product.name}</td> 
                        <td className="text-right">{item.price.toLocaleString('th-TH')}</td> 
                        <td className="text-right">1</td> 
                    </tr>
                    ) : <></>}
                </tbody>
            </table>
            <div className="text-right mt-3">รวมราคา {sumPrice.toLocaleString('th-TH')} บาท</div>
        </Mymodal>

    </BackOffice>
}
export default BillSale;