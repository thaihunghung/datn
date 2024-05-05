import React, { useState, useEffect } from "react";
import { axiosAdmin } from "../../../../service/AxiosAdmin";
import "./Home.css";

const Home = () => {
  const [pos, setPos] = useState([]);
  const [plos, setPlos] = useState([]);
  const [poPlos, setPoPlos] = useState([]);

  const GetAllPo = async () => {
    try {
      const response = await axiosAdmin.get('/po');
      setPos(response.data);
    } catch (error) {
      console.error('Error fetching POs:', error);
    }
  };

  const GetAllPlo = async () => {
    try {
      const response = await axiosAdmin.get('/plo');
      setPlos(response.data);
    } catch (error) {
      console.error('Error fetching PLOs:', error);
    }
  };

  const GetAllPoPlo = async () => {
    try {
      const response = await axiosAdmin.get('/po-plo');
      setPoPlos(response.data);
    } catch (error) {
      console.error('Error fetching PO-PLO mappings:', error);
    }
  };

  useEffect(() => {
    GetAllPo();
    GetAllPlo();
    GetAllPoPlo();
  }, []);

  return (
    <div className="w-full flex justify-center p-10">
      <div>
        <table className="table-auto border-collapse border">
          <thead>
            <tr>
              <th className="px-4 py-2 bg-gray-800 text-white">STT</th>
              <th className="px-4 py-2 bg-gray-800 text-white">PLO</th>
              <th className="px-4 py-2 bg-gray-800 text-white">Nội dung</th>
              {pos.map((po_item) => (
                <th key={po_item.po_id_VB} className="px-4 py-2 bg-gray-800 text-white">
                  {po_item.po_id_VB}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {plos.map((plo_item, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{plo_item.plo_name}</td>
                <td className="border px-4 py-2">{plo_item.plo_id_VB}</td>
                {pos.map((po_item) => {
                  const found = poPlos.find(
                    (item) => item.plo_id === plo_item.plo_id && item.po_id === po_item.po_id
                  );
                  return (
                    <td key={po_item.po_id} className="border px-4 py-2">
                      {found ? 'X' : '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <table className="table-auto border-collapse border">
          <thead>
            <tr>
              <th className="px-4 py-2 bg-gray-800 text-white">STT</th>
              <th className="px-4 py-2 bg-gray-800 text-white">PLO</th>
              <th className="px-4 py-2 bg-gray-800 text-white">Nội dung</th>
              {pos.map((po_item) => (
                <th key={po_item.po_id_VB} className="px-4 py-2 bg-gray-800 text-white">
                  {po_item.po_id_VB}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {plos.map((plo_item, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{plo_item.plo_name}</td>
                <td className="border px-4 py-2">{plo_item.plo_id_VB}</td>
                {pos.map((po_item) => {
                  const found = poPlos.find(
                    (item) => item.plo_id === plo_item.plo_id && item.po_id === po_item.po_id
                  );
                  return (
                    <td key={po_item.po_id} className="border px-4 py-2">
                      <input
                        type="checkbox"
                        checked={found}
                        onChange={(e) => {}}
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
