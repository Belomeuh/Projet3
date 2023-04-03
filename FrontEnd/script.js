console.log("bonjour");

const getCategories = fetch("http://localhost:5678/api/categories")
  .then(response => response.json())
  .then(data => {
    const gallery = document.querySelector('.filters');
    const ul = document.createElement('ul');
    ul.className = 'galleryCategories';
    gallery.appendChild(ul)
    
    const galleryCategories = document.querySelector('.galleryCategories');
    const allFilter = document.createElement('li');
    allFilter.className = "filter_0";
    allFilter.textContent = "Tous";
    galleryCategories.appendChild(allFilter)

    const categories = data.map(category => {
      const li = document.createElement('li');
      li.className = `filter_${category.id}`;
      li.textContent = category.name
      galleryCategories.appendChild(li)

      return li;
    });
 
    galleryCategories.append(...categories);
  });

const getWorks = fetch("http://localhost:5678/api/works")
  .then(response => response.json())
  .then(data => {
    const gallery = document.querySelector('.gallery');
    const works = data.map(work => {
      const figure = document.createElement('figure');
      figure.className = 'work';

      const img = document.createElement('img');
      img.src = work.imageUrl;

      const figcaption = document.createElement('figcaption');
      figcaption.textContent = work.title;

      figure.appendChild(img);
      figure.appendChild(figcaption);

      return figure;
    });

    gallery.append(...works);
  })




  