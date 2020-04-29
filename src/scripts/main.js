import $ from "jquery";
import moment from "moment";

function main() {
    const baseUrl = "https://api.banghasan.com/sholat/format/json/";
    const droplist = document.querySelector('#droplist');

    // Class Spinners Behavior
    class spinners {
        static enable() {
            $('#spinner').show();
            $('#submit').prop('disabled', true);
        }

        static disable() {
            $('#spinner').hide();
            $('#submit').prop('disabled', false);
        }
    }

    // Fungsi Memanggil Kota untuk Render Dropdown
    const getCities = async () => {
        try {
            const response = await fetch(`${baseUrl}/kota`);
            const responseJson = await response.json();

            renderDropdown(responseJson.kota)
        } catch (error) {
            console.log(error);
        }
    }

    // Funsgi Membuat Huruf pertama kota menjadi Kapital
    const capitalize_Words = (str) => {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    // Funsgi Mengambil Data Jadwal Shalat berdasarkan value dropdown yang dipilih
    const getPrayerTime = async () => {
        try {
            const selectedValue = $("#droplist").find(":selected").val();
            const selectedText = $("#droplist").find(":selected").text();
            const capitalFistWords = capitalize_Words(selectedText);
            const today = moment().format("YYYY-MM-DD");

            const response = await fetch(`${baseUrl}/jadwal/kota/${selectedValue}/tanggal/${today}`);
            const responseJson = await response.json();

            $('#kota').text(`${capitalFistWords},`);
            renderPrayerTime(responseJson.jadwal.data);
        } catch (error) {
            console.log(error);
        }
    }

    // fungsi merender element option berdasarkan data kota
    const renderDropdown = (kota) => {
        $.each(kota, (index, item) => {
            droplist.innerHTML +=
                `<option value='${item.id}'>${item.nama}</option>`;
        })
    }

    //fungsi merender data jadwal shalat ke element 
    const renderPrayerTime = async (data) => {
        $('#imsak').text(`${data.imsak}`);
        $('#subuh').text(`${data.subuh}`);
        $('#dzuhur').text(`${data.dzuhur}`);
        $('#ashar').text(`${data.ashar}`);
        $('#maghrib').text(`${data.maghrib}`);
        $('#isya').text(`${data.isya}`);
    }

    const displayTime = () => {
        moment.locale("id");
        $("#time").text(moment().format("HH:mm:ss"));
        $("#date").text(moment().format("dddd DD MMMM YYYY"));
    };

    // Update Waktu setiap satu detik
    const updateTime = () => {
        displayTime();
        setTimeout(updateTime, 1000)
    };

    // Ketika DOM content di load
    $(function () {
        spinners.disable();
        $('#submit').click(function () {
            const selectedValue = $("#droplist").find(":selected").val();
            if (selectedValue === 'default') {
                $('#myModal').modal();
            } else {
                spinners.enable();
                getPrayerTime().then(disable => {
                    spinners.disable();
                })
            }
        });

        updateTime();
        getCities();
    })

}

export default main;