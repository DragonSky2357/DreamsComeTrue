import axios from "axios";
import React, { useEffect, useState } from "react";
import { PhotoAlbum } from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";

const MainPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/post`)
      .then((response: any) => {
        response.data.map((item: any) => {
          item["photo"] = { src: item.imageUrl, width: 800, height: 600 };
        });
        setData(response.data);
      });
  }, []);

  const photos = [
    {
      src: "https://oaidalleapiprodscus.blob.core.windows.net/private/org-vznyuFW1peOTpU35dpJgXKhv/user-o3JO9A4Vu4YVNOOVjlTe4RJk/img-pQ7L3f7a0oGmVGyvpS4FLu7u.png?st=2023-03-19T05%3A59%3A30Z&se=2023-03-19T07%3A59%3A30Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-03-19T06%3A04%3A44Z&ske=2023-03-20T06%3A04%3A44Z&sks=b&skv=2021-08-06&sig=Gjm%2B1z5eXDKV%2Bet%2Bw36hP3g6NPpjcjOY%2BdmH4GSJV10%3D",
      width: 4,
      height: 3,
      images: [],
    },
    {
      src: "https://oaidalleapiprodscus.blob.core.windows.net/private/org-vznyuFW1peOTpU35dpJgXKhv/user-o3JO9A4Vu4YVNOOVjlTe4RJk/img-OxXsZRciynAwK8Hm77vuwXuI.png?st=2023-03-19T06%3A20%3A08Z&se=2023-03-19T08%3A20%3A08Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-03-19T05%3A53%3A00Z&ske=2023-03-20T05%3A53%3A00Z&sks=b&skv=2021-08-06&sig=wQJMhHhplgchVL9nYsWywcj5HwGqbvYOXrbkeM3oDXQ%3D",
      width: 1,
      height: 1,
    },
    {
      src: "https://openailabsprodscus.blob.core.windows.net/private/user-o3JO9A4Vu4YVNOOVjlTe4RJk/generations/generation-ZBDf4sPx6MUnVasl5LVZQJTi/image.webp?st=2023-03-19T06%3A32%3A50Z&se=2023-03-19T08%3A30%3A50Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/webp&skoid=15f0b47b-a152-4599-9e98-9cb4a58269f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-03-19T07%3A21%3A45Z&ske=2023-03-26T07%3A21%3A45Z&sks=b&skv=2021-08-06&sig=iytoQAKL4lLXyDkIua1E30mnh4QOSayp7o6oXpaohyY%3D",
      width: 1,
      height: 1,
    },
    {
      src: "https://oaidalleapiprodscus.blob.core.windows.net/private/org-vznyuFW1peOTpU35dpJgXKhv/user-o3JO9A4Vu4YVNOOVjlTe4RJk/img-OxXsZRciynAwK8Hm77vuwXuI.png?st=2023-03-19T06%3A20%3A08Z&se=2023-03-19T08%3A20%3A08Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-03-19T05%3A53%3A00Z&ske=2023-03-20T05%3A53%3A00Z&sks=b&skv=2021-08-06&sig=wQJMhHhplgchVL9nYsWywcj5HwGqbvYOXrbkeM3oDXQ%3D",
      width: 3,
      height: 5,
    },
    {
      src: "https://openailabsprodscus.blob.core.windows.net/private/user-o3JO9A4Vu4YVNOOVjlTe4RJk/generations/generation-qKu5P16TUjDNtiAjLhKPnPr1/image.webp?st=2023-03-19T06%3A32%3A50Z&se=2023-03-19T08%3A30%3A50Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/webp&skoid=15f0b47b-a152-4599-9e98-9cb4a58269f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-03-19T07%3A21%3A45Z&ske=2023-03-26T07%3A21%3A45Z&sks=b&skv=2021-08-06&sig=796EX6YnU7JzjMlZvNUdUzhtfqdZhM68WA8Xt8nOuZo%3D",
      width: 8,
      height: 9,
    },
  ];

  return (
    <div>
      <PhotoAlbum layout="columns" photos={photos} targetRowHeight={150} />;
      <button type="button" onClick={() => setOpen(!open)}>
        Open Lightbox
      </button>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={[
          {
            src: "https://oaidalleapiprodscus.blob.core.windows.net/private/org-vznyuFW1peOTpU35dpJgXKhv/user-o3JO9A4Vu4YVNOOVjlTe4RJk/img-pQ7L3f7a0oGmVGyvpS4FLu7u.png?st=2023-03-19T05%3A59%3A30Z&se=2023-03-19T07%3A59%3A30Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-03-19T06%3A04%3A44Z&ske=2023-03-20T06%3A04%3A44Z&sks=b&skv=2021-08-06&sig=Gjm%2B1z5eXDKV%2Bet%2Bw36hP3g6NPpjcjOY%2BdmH4GSJV10%3D",
          },
          {
            src: "https://oaidalleapiprodscus.blob.core.windows.net/private/org-vznyuFW1peOTpU35dpJgXKhv/user-o3JO9A4Vu4YVNOOVjlTe4RJk/img-OxXsZRciynAwK8Hm77vuwXuI.png?st=2023-03-19T06%3A20%3A08Z&se=2023-03-19T08%3A20%3A08Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-03-19T05%3A53%3A00Z&ske=2023-03-20T05%3A53%3A00Z&sks=b&skv=2021-08-06&sig=wQJMhHhplgchVL9nYsWywcj5HwGqbvYOXrbkeM3oDXQ%3D",
          },
          {
            src: "https://openailabsprodscus.blob.core.windows.net/private/user-o3JO9A4Vu4YVNOOVjlTe4RJk/generations/generation-qKu5P16TUjDNtiAjLhKPnPr1/image.webp?st=2023-03-19T06%3A32%3A50Z&se=2023-03-19T08%3A30%3A50Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/webp&skoid=15f0b47b-a152-4599-9e98-9cb4a58269f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-03-19T07%3A21%3A45Z&ske=2023-03-26T07%3A21%3A45Z&sks=b&skv=2021-08-06&sig=796EX6YnU7JzjMlZvNUdUzhtfqdZhM68WA8Xt8nOuZo%3D",
          },
        ]}
      />
    </div>
  );
};

export default MainPage;
