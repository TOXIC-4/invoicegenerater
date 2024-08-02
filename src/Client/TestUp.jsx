import React, { useState } from "react";
import Api from "../MainApi";
const TestUp = () => {
  const [fileData, setFileData] = useState("");
  console.log(fileData);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("file", fileData);

      console.log(data);
      const resp = await fetch(`${Api}/api/testUp`, {
        method: "POST",
        body: data,
      });
      console.log(await resp.json());
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      TestUp
      <form className="" encType="multipart/form-data" onSubmit={handleSubmit}>
        <input
          type="file"
          name="file"
          onChange={(e) => setFileData(e.target.files[0])}
        />
        <input type="submit" />
      </form>
    </div>
  );
};

export default TestUp;
