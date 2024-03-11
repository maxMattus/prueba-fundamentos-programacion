

$(document).ready(function() {
    $('#searchBtn').click(function() {
        var heroId = $('#heroId').val();

        if (!/^\d+$/.test(heroId)) {
            alert('Por favor ingrese un número ID válido.');
            return;
        }

        getSuperheroData(heroId);
    });

    function getSuperheroData(heroId) {
        $.ajax({
            url: 'https://www.superheroapi.com/api.php/1846724502424894/' + heroId,
            method: 'GET',
            success: function(data) {
                renderHeroCard(data);
                renderChart(data.powerstats);
            },
            error: function() {
                alert('Error fetching superhero data. Please try again.');
            }
        });
    }

    function renderHeroCard(data) {
        document.getElementById('heroName').textContent = data.name;
        document.getElementById('heroDescription').textContent = data.biography['full-name'];

        const heroImage = document.querySelector('.card-img-top');
        heroImage.src = data.image.url;

        const heroInfoList = document.getElementById('heroInfoList');
        heroInfoList.innerHTML = '';

        // Uso la informacion del array para dejarlos en card de bootstrap
        addInfoToList(heroInfoList, 'Publicación', data.biography.publisher);
        addInfoToList(heroInfoList, 'Ocupación', data.work.occupation);
        addInfoToList(heroInfoList, 'Primera Aparición', data.biography['first-appearance']);
        addInfoToList(heroInfoList, 'Altura', data.appearance.height[1]);
        addInfoToList(heroInfoList, 'Peso', data.appearance.weight[1]);
        addInfoToList(heroInfoList, 'Alianza', data.connections['group-affiliation']);
    }

    function addInfoToList(list, label, value) {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        listItem.innerHTML = `<strong>${label}:</strong> ${value}`;
        list.appendChild(listItem);
    }

    function renderChart(powerstats) {
        let chartData = [];

        for (const stat in powerstats) {
            chartData.push({ y: parseFloat(powerstats[stat]), label: stat });
        }

        let chart = new CanvasJS.Chart("chartContainer", {
            theme: "light2",
            exportEnabled: true,
            animationEnabled: true,
            title: {
                text: "Estadística de Poder"
            },
            data: [{
                type: "pie",
                startAngle: 25,
                toolTipContent: "<b>{label}</b>: {y}",
                showInLegend: "true",
                legendText: "{label}",
                indexLabelFontSize: 16,
                indexLabel: "{label} - {y}",
                dataPoints: chartData
            }]
        });

        chart.render();
    }
});