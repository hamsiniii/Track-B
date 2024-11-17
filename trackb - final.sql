create database trackb;
use trackb;
-- creates:
create table artist (
    artistid int primary key auto_increment,
    fname varchar(100),
    lname varchar(100),
    dob date,
    about text,
    image longblob
);

create table album (
    albumid int primary key auto_increment,
    name varchar(100),
    releasedate date,
    coverart varchar(255)
);

create table song (
    songid int primary key auto_increment,
    name varchar(100),
    releasedate date,
    coverart varchar(255),
    genre varchar(50)
);

create table user (
    userid int primary key auto_increment,
    name varchar(100),
    password varchar(255),
    email varchar(100),
    role varchar(50)
);

create table review (
    reviewid int primary key auto_increment,
    rating int,
    comment text,
    date date,
    songid int,
    albumid int,
    userid int,
    foreign key (songid) references song(songid),
    foreign key (albumid) references album(albumid),
    foreign key (userid) references user(userid)
);

create table artistalbum (
    artistid int,
    albumid int,
    primary key (artistid, albumid),
    foreign key (artistid) references artist(artistid),
    foreign key (albumid) references album(albumid)
);

create table artistsong (
    artistid int,
    songid int,
    primary key (artistid, songid),
    foreign key (artistid) references artist(artistid),
    foreign key (songid) references song(songid)
);

create table albumsong (
    albumid int,
    songid int,
    primary key (albumid, songid),
    foreign key (albumid) references album(albumid),
    foreign key (songid) references song(songid)
);

create table songgenre (
    songid int,
    genre varchar(50),
    primary key (songid, genre),
    foreign key (songid) references song(songid)
);

-- inserts:

insert into album (albumid, name, releasedate, coverart) values
(1, 'Silence Between Songs', '2023-01-01', 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Madison_Beer_Silence_Between_Songs.png/220px-Madison_Beer_Silence_Between_Songs.png'),
(2, 'Blackbird', '2007-10-08', 'https://upload.wikimedia.org/wikipedia/en/1/13/Alterbridge_blackbird.jpg'),
(3, 'Hotel California', '1976-12-08', 'https://upload.wikimedia.org/wikipedia/en/thumb/4/49/Hotelcalifornia.jpg/220px-Hotelcalifornia.jpg'),
(4, 'Beatopia', '2022-07-15', 'https://upload.wikimedia.org/wikipedia/en/8/81/Beabadoobee_-_Beatopia.png'),
(5, 'Positions', '2020-10-30', 'https://upload.wikimedia.org/wikipedia/en/a/a0/Ariana_Grande_-_Positions.png'),
(6, 'Abbey Road', '1969-09-26', 'https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg'),
(7, 'Brothers in Arms', '1985-05-13', 'https://upload.wikimedia.org/wikipedia/en/6/67/DS_Brothers_in_Arms.jpg'),
(8, 'Born to Die', '2012-01-27', 'https://upload.wikimedia.org/wikipedia/en/2/29/BornToDieAlbumCover.png'),
(9, 'After Hours', '2020-03-20', 'https://upload.wikimedia.org/wikipedia/en/c/c1/The_Weeknd_-_After_Hours.png'),
(10, 'The Fame', '2008-08-19', 'https://upload.wikimedia.org/wikipedia/en/d/dd/Lady_Gaga_%E2%80%93_The_Fame_album_cover.png'),
(11, '24K Magic', '2016-11-18', 'https://upload.wikimedia.org/wikipedia/en/2/2b/Bruno_Mars_-_24K_Magic_%28Official_Album_Cover%29.png');

-- Silence Between Songs (albumid = 1)
insert into song (songid, name, releasedate, coverart) values
(1, 'Reckless', '2023-09-15', 'https://upload.wikimedia.org/wikipedia/en/d/d3/Madison_Beer_Silence_Between_Songs.png'),
(2, 'Dangerous', '2023-09-15', 'https://upload.wikimedia.org/wikipedia/en/d/d3/Madison_Beer_Silence_Between_Songs.png'),
(3, 'Showed Me', '2023-09-15', 'https://upload.wikimedia.org/wikipedia/en/d/d3/Madison_Beer_Silence_Between_Songs.png');
-- Blackbird (albumid = 2)
insert into song (songid, name, releasedate, coverart) values
(4, 'Watch Over You', '2007-10-09', 'https://upload.wikimedia.org/wikipedia/en/1/13/Alterbridge_blackbird.jpg'),
(5, 'Rise Today', '2007-10-09', 'https://upload.wikimedia.org/wikipedia/en/1/13/Alterbridge_blackbird.jpg'),
(6, 'Blackbird', '2007-10-09', 'https://upload.wikimedia.org/wikipedia/en/1/13/Alterbridge_blackbird.jpg');
-- Hotel California (albumid = 3)
insert into song (songid, name, releasedate, coverart) values
(7, 'Hotel California', '1976-12-08', 'https://upload.wikimedia.org/wikipedia/en/4/49/Hotelcalifornia.jpg'),
(8, 'New Kid in Town', '1976-12-08', 'https://upload.wikimedia.org/wikipedia/en/4/49/Hotelcalifornia.jpg'),
(9, 'Life in the Fast Lane', '1976-12-08', 'https://upload.wikimedia.org/wikipedia/en/4/49/Hotelcalifornia.jpg');
-- Beatopia (albumid = 4)
insert into song (songid, name, releasedate, coverart) values
(10, 'Talk', '2022-07-15', 'https://upload.wikimedia.org/wikipedia/en/8/81/Beabadoobee_-_Beatopia.png'),
(11, 'See You Soon', '2022-07-15', 'https://upload.wikimedia.org/wikipedia/en/8/81/Beabadoobee_-_Beatopia.png'),
(12, '10:36', '2022-07-15', 'https://upload.wikimedia.org/wikipedia/en/8/81/Beabadoobee_-_Beatopia.png');
-- Positions (albumid = 5)
insert into song (songid, name, releasedate, coverart) values
(13, 'Positions', '2020-10-30', 'https://upload.wikimedia.org/wikipedia/en/a/a0/Ariana_Grande_-_Positions.png'),
(14, '34+35', '2020-10-30', 'https://upload.wikimedia.org/wikipedia/en/a/a0/Ariana_Grande_-_Positions.png'),
(15, 'pov', '2020-10-30', 'https://upload.wikimedia.org/wikipedia/en/a/a0/Ariana_Grande_-_Positions.png');
-- Abbey Road (albumid = 6)
insert into song (songid, name, releasedate, coverart) values
(16, 'Come Together', '1969-09-26', 'https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg'),
(17, 'Something', '1969-09-26', 'https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg'),
(18, 'Here Comes the Sun', '1969-09-26', 'https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg');
-- Brothers in Arms (albumid = 7)
insert into song (songid, name, releasedate, coverart) values
(19, 'Money for Nothing', '1985-05-13', 'https://upload.wikimedia.org/wikipedia/en/6/67/DS_Brothers_in_Arms.jpg'),
(20, 'Walk of Life', '1985-05-13', 'https://upload.wikimedia.org/wikipedia/en/6/67/DS_Brothers_in_Arms.jpg'),
(21, 'Brothers in Arms', '1985-05-13', 'https://upload.wikimedia.org/wikipedia/en/6/67/DS_Brothers_in_Arms.jpg');
-- Born to Die (albumid = 8)
insert into song (songid, name, releasedate, coverart) values
(22, 'Born to Die', '2012-01-27', 'https://upload.wikimedia.org/wikipedia/en/2/29/BornToDieAlbumCover.png'),
(23, 'Blue Jeans', '2012-01-27', 'https://upload.wikimedia.org/wikipedia/en/2/29/BornToDieAlbumCover.png'),
(24, 'Video Games', '2012-01-27', 'https://upload.wikimedia.org/wikipedia/en/2/29/BornToDieAlbumCover.png');
-- After Hours (albumid = 9)
insert into song (songid, name, releasedate, coverart) values
(25, 'Blinding Lights', '2020-03-20', 'https://upload.wikimedia.org/wikipedia/en/c/c1/The_Weeknd_-_After_Hours.png'),
(26, 'Save Your Tears', '2020-03-20', 'https://upload.wikimedia.org/wikipedia/en/c/c1/The_Weeknd_-_After_Hours.png'),
(27, 'In Your Eyes', '2020-03-20', 'https://upload.wikimedia.org/wikipedia/en/c/c1/The_Weeknd_-_After_Hours.png');
-- The Fame (albumid = 10)
insert into song (songid, name, releasedate, coverart) values
(28, 'Just Dance', '2008-08-19', 'https://upload.wikimedia.org/wikipedia/en/d/dd/Lady_Gaga_%E2%80%93_The_Fame_album_cover.png'),
(29, 'Poker Face', '2008-08-19', 'https://upload.wikimedia.org/wikipedia/en/d/dd/Lady_Gaga_%E2%80%93_The_Fame_album_cover.png'),
(30, 'Paparazzi', '2008-08-19', 'https://upload.wikimedia.org/wikipedia/en/d/dd/Lady_Gaga_%E2%80%93_The_Fame_album_cover.png');
-- 24K Magic (albumid = 11)
insert into song (songid, name, releasedate, coverart) values
(31, '24K Magic', '2016-11-18', 'https://upload.wikimedia.org/wikipedia/en/2/2b/Bruno_Mars_-_24K_Magic_%28Official_Album_Cover%29.png'),
(32, 'That’s What I Like', '2016-11-18', 'https://upload.wikimedia.org/wikipedia/en/2/2b/Bruno_Mars_-_24K_Magic_%28Official_Album_Cover%29.png'),
(33, 'Versace on the Floor', '2016-11-18', 'https://upload.wikimedia.org/wikipedia/en/2/2b/Bruno_Mars_-_24K_Magic_%28Official_Album_Cover%29.png');

insert into artist (fname, lname, dob, about) values
('Madison', 'Beer', '1999-03-05', 'American singer known for her pop and R&B music. Gained recognition through YouTube and later released her debut album "Life Support".'),
('Ariana', 'Grande', '1993-06-26', 'American pop and R&B singer with multiple Grammy awards. Known for her four-octave vocal range and albums like "Sweetener" and "Positions".'),
('The', 'Beatles', '1960-01-01', 'Iconic British rock band from Liverpool formed by John Lennon, Paul McCartney, George Harrison, and Ringo Starr. Pioneers in modern rock music.'),
('The', 'Weeknd', '1990-02-16', 'Canadian singer and songwriter known for his unique blend of R&B and pop. Albums include "After Hours" and "Dawn FM".'),
('Lana', 'Del Ray', '1985-06-21', 'American singer-songwriter known for her cinematic style. Popular songs include "Born to Die" and "Young and Beautiful".'),
('Dire', 'Straits', '1977-01-01', 'British rock band formed by Mark Knopfler, known for songs like "Sultans of Swing". They blend rock, jazz, and blues elements.'),
('The', 'Eagles', '1971-01-01', 'American rock band known for hits like "Hotel California" and "Desperado". Pioneers of country rock.'),
('Jennie', 'Kim', '1996-01-16', 'South Korean singer, rapper, and member of the K-pop group BLACKPINK. Released solo debut single "SOLO" in 2018.'),
('Lady', 'Gaga', '1986-03-28', 'American pop singer and actress known for her flamboyant style. Albums include "The Fame" and "Chromatica".'),
('Bruno', 'Mars', '1985-10-08', 'American singer and songwriter known for his eclectic style blending pop, funk, and soul. Hits include "Uptown Funk" and "24K Magic".'),
('Bea', 'Kristi', '2000-06-03', 'Filipino-British singer known by her stage name Beabadoobee. Known for indie pop music and tracks like "Coffee".'),
('Alter', 'Bridge', '2004-01-01', 'American rock band formed by former members of Creed. Known for albums like "Blackbird" and "Fortress".');

update artist set image = LOAD_FILE('C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads\\Madison-Beer.jpg') where artistid=1;
update artist set image = LOAD_FILE('C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads\\Ariana-Grande.png') where artistid=2;
update artist set image = LOAD_FILE('C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads\\The-Beatles.jpg') where artistid=3;
update artist set image = LOAD_FILE('C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads\\The-Weeknd.jpg') where artistid=4;
update artist set image = LOAD_FILE("C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads\\Lana-Del-Ray.jpg") where artistid=5;
update artist set image = LOAD_FILE("C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads\\Dire-Straits.jpg") where artistid=6;
update artist set image = LOAD_FILE("C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads\\The-Eagles.jpg") where artistid=7;
update artist set image = LOAD_FILE("C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads\\Kim-Jennie.jpg") where artistid=8;
update artist set image = LOAD_FILE("C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads\\Lady-Gaga.jpg") where artistid=9;
update artist set image = LOAD_FILE("C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads\\Bruno-Mars.jpg") where artistid=10;
update artist set image = LOAD_FILE("C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads\\Bea-Kristi.jpg") where artistid=11;
update artist set image = LOAD_FILE("C:\\ProgramData\\MySQL\\MySQL Server 8.0\\Uploads\\Alter-Bridge.jpg") where artistid=12;

-- silence between songs (albumid = 1)
insert into albumsong (albumid, songid) values (1, 1), (1, 2), (1, 3);
-- blackbird (albumid = 2)
insert into albumsong (albumid, songid) values (2, 4), (2, 5), (2, 6);
-- hotel california (albumid = 3)
insert into albumsong (albumid, songid) values (3, 7), (3, 8), (3, 9);
-- beatopia (albumid = 4)
insert into albumsong (albumid, songid) values (4, 10), (4, 11), (4, 12);
-- positions (albumid = 5)
insert into albumsong (albumid, songid) values (5, 13), (5, 14), (5, 15);
-- abbey road (albumid = 6)
insert into albumsong (albumid, songid) values (6, 16), (6, 17), (6, 18);
-- brothers in arms (albumid = 7)
insert into albumsong (albumid, songid) values (7, 19), (7, 20), (7, 21);
-- born to die (albumid = 8)
insert into albumsong (albumid, songid) values (8, 22), (8, 23), (8, 24);
-- after hours (albumid = 9)
insert into albumsong (albumid, songid) values (9, 25), (9, 26), (9, 27);
-- the fame (albumid = 10)
insert into albumsong (albumid, songid) values (10, 28), (10, 29), (10, 30);
-- 24k magic (albumid = 11)
insert into albumsong (albumid, songid) values (11, 31), (11, 32), (11, 33);

-- update genres in song table
update song set genre = 'pop' where songid in (1, 2, 3);
update song set genre = 'rock' where songid in (4, 5, 6);
update song set genre = 'rock' where songid in (7, 8, 9);
update song set genre = 'indie rock' where songid in (10, 11, 12);
update song set genre = 'pop' where songid in (13, 14, 15);
update song set genre = 'rock' where songid in (16, 17, 18);
update song set genre = 'rock' where songid in (19, 20, 21);
update song set genre = 'alternative' where songid in (22, 23, 24);
update song set genre = 'r&b' where songid in (25, 26, 27);
update song set genre = 'pop' where songid in (28, 29, 30);
update song set genre = 'r&b' where songid in (31, 32, 33);

-- triggers:

delimiter $$
create trigger after_artalb
after insert on artistalbum
for each row
begin
    insert into artistsong (artistid, songid)
    select new.artistid, songid 
    from albumsong 
    where albumid = new.albumid;
end$$
delimiter ;
insert into artistalbum (artistid, albumid) values 
(1, 1), (2, 5), (3, 6), (4, 9), (5, 8), 
(6, 7), (7, 3), (9, 10), (10, 11), (11, 4), (12, 2);

delimiter $$
create trigger update_user_role_after_insert
after insert on review
for each row
begin
    declare review_count int;
    select count(*) into review_count
    from review
    where userid = new.userid;
    if review_count >= 3 then
        update user
        set role = 'critic'
        where userid = new.userid;
    end if;
end;
$$

create trigger update_user_role_after_delete
after delete on review
for each row
begin
    declare review_count int;
    select count(*) into review_count
    from review
    where userid = old.userid;
    if review_count < 3 then
        update user
        set role = 'user'
        where userid = old.userid;
    end if;
end;
$$
delimiter ;

-- functions:

-- insert songid and genre from song table into songgenre
delimiter //
create function insert_into_songgenre()
returns int
deterministic
begin
    insert into songgenre (songid, genre)
    select songid, genre
    from song
    where genre is not null;

    return row_count();
end //
delimiter ;
select insert_into_songgenre();

-- procedures:

delimiter //
create procedure getsongdetails(in songid int)
begin
    select
        s.songid,
        s.name,
        s.releasedate,
        s.coverart,
        a.albumid,
        a.name as album_name,
        avg(r.rating) as average_rating
    from
        song s
    left join
        albumsong als on s.songid = als.songid
    left join
        album a on als.albumid = a.albumid
    left join
        review r on s.songid = r.songid
    where
        s.songid = songid
    group by
        s.songid, s.name, s.releasedate, s.coverart, a.albumid, a.name;
end //

create procedure getalbumdetails(in albumid int)
begin
    select 
        a.albumid,
        a.name,
        a.releasedate,
        a.coverart,
        (select count(*) 
         from albumsong als 
         where als.albumid = a.albumid) as song_count,  
        avg(r.rating) as average_rating                
    from 
        album a
    left join 
        review r on a.albumid = r.albumid
    where 
        a.albumid = albumid
    group by 
        a.albumid, a.name, a.releasedate, a.coverart;  
end //
delimiter ;

delimiter //
create procedure getsongsbyalbumid(in albumid int)
begin
    select 
        s.songid, 
        s.name, 
        s.releasedate, 
        s.coverart 
    from 
        song s
    join 
        albumsong als on s.songid = als.songid
    where 
        als.albumid = albumid;
end //
delimiter ;

-- users:

create user badmin identified by 'securepassword';
grant all on trackb.* to badmin;
revoke all privileges on *.* from 'badmin'@'%';
flush privileges;

-- grant select privileges on all tables
grant select on trackb.* to 'badmin'@'%';
-- grant insert, update, delete privileges on the user table
grant insert, update, delete on trackb.user to 'badmin'@'%';
-- grant insert, update, delete privileges on the review table
grant insert, update, delete on trackb.review to 'badmin'@'%';
flush privileges;

-- admin user:
create user 'admin'@'%' identified by 'your_password_here';
-- grant all privileges to admin on the entire database
grant all privileges on trackb.* to 'admin'@'%';
flush privileges;

-- cascades: 

-- review table: add on delete cascade for foreign keys
alter table review 
add constraint review_songid_fk 
foreign key (songid) references song(songid) 
on delete cascade,
add constraint review_albumid_fk 
foreign key (albumid) references album(albumid) 
on delete cascade,
add constraint review_userid_fk 
foreign key (userid) references user(userid) 
on delete cascade;

-- artistalbum table: add on delete cascade for foreign keys
alter table artistalbum 
add constraint artistalbum_artistid_fk 
foreign key (artistid) references artist(artistid) 
on delete cascade,
add constraint artistalbum_albumid_fk 
foreign key (albumid) references album(albumid) 
on delete cascade;

-- artistsong table: add on delete cascade for foreign keys
alter table artistsong 
add constraint artistsong_artistid_fk 
foreign key (artistid) references artist(artistid) 
on delete cascade,
add constraint artistsong_songid_fk 
foreign key (songid) references song(songid) 
on delete cascade;

-- albumsong table: add on delete cascade for foreign keys
alter table albumsong 
add constraint albumsong_albumid_fk 
foreign key (albumid) references album(albumid) 
on delete cascade,
add constraint albumsong_songid_fk 
foreign key (songid) references song(songid) 
on delete cascade;

-- songgenre table: add on delete cascade for foreign keys
alter table songgenre 
add constraint songgenre_songid_fk 
foreign key (songid) references song(songid) 
on delete cascade;
