function highlight(table) {
  if (!table) {return;}

  [...table.tBodies].reduce((a, b) => a.concat([...b.rows]), [])
                    .forEach(tr => {
                      const [status, gender, age] = [...tr.children].reverse();

                      switch (status.dataset.available) {
                      case 'true':
                        tr.classList.add('available');
                        break;
                      case 'false':
                        tr.classList.add('unavailable');
                        break;
                      case undefined:
                        tr.hidden = true;
                        break;
                      }

                      switch (gender.textContent) {
                      case "m":
                        tr.classList.add('male');
                        break;
                      case "f":
                        tr.classList.add('female');
                        break;
                      }

                      tr.style.textDecoration = Number(age.textContent) < 18 ? 'line-through' : '';
                    });
}
