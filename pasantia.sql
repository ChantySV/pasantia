drop database if exists Repositorio;

CREATE DATABASE Repositorio;

USE Repositorio;

CREATE TABLE Documentos (
    id_documento INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(255) not null,
    facultad varchar(255) not null,
    carrera VARCHAR(255) not null,    
    titulo VARCHAR(255),
    autor VARCHAR(255) not null,
    año YEAR not null,
    sede varchar(255) not null,
    ruta_pdf VARCHAR(255) not null
);


INSERT INTO Documentos (tipo, facultad, carrera, titulo, autor, año, sede, ruta_pdf)
VALUES ('Proyecto de grado', 'Ingenieria', 'Ingeniería en redes y telecomunicaciones', 
'DISEÑO DE RED CON ERBIUM DOPED FIBER AMPLIFIER 
Y TECNOLOGÍA GIGABIT PASSIVE OPTICAL NETWORK CON SERVICIOS DE BANDA ANCHA EN LA ZONA SAN ANTONIO ALTO
CASO: COOPERATIVA COTEL R.L.', 
'Valeria Iris Tapia Moreno', 2022, 'La Paz', 'proyecto1.pdf');

create table usuarios (
id_usuario int auto_increment primary key,
nombre varchar (255),
contraseña varchar (60)
);

insert into usuarios  (nombre, contraseña)
values('sorel', '1234');