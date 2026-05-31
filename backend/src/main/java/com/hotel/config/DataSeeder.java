package com.hotel.config;

import com.hotel.entity.Room;
import com.hotel.entity.RoomType;
import com.hotel.entity.User;
import com.hotel.entity.enums.RoomStatus;
import com.hotel.entity.enums.UserRole;
import com.hotel.repository.RoomRepository;
import com.hotel.repository.RoomTypeRepository;
import com.hotel.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoomTypeRepository roomTypeRepository;
    private final RoomRepository roomRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedAdmin();
        seedRoomTypes();
        seedRooms();
        log.info("数据初始化完成");
    }

    private void seedAdmin() {
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(UserRole.ADMIN);
            admin.setName("管理员");
            userRepository.save(admin);
            log.info("创建管理员账号: admin/admin123");
        }
    }

    private void seedRoomTypes() {
        if (roomTypeRepository.count() == 0) {
            roomTypeRepository.save(new RoomType(null, "单人间", new BigDecimal("299"), 1, "温馨舒适的单人房间", "WiFi,TV,空调"));
            roomTypeRepository.save(new RoomType(null, "双人间", new BigDecimal("399"), 2, "宽敞明亮的双人房间", "WiFi,TV,空调,迷你吧"));
            roomTypeRepository.save(new RoomType(null, "套房", new BigDecimal("699"), 4, "豪华舒适套房", "WiFi,TV,空调,迷你吧,浴缸"));
            log.info("创建3种房间类型");
        }
    }

    private void seedRooms() {
        if (roomRepository.count() == 0) {
            var types = roomTypeRepository.findAll();
            RoomType single = types.get(0);
            RoomType double_ = types.get(1);
            RoomType suite = types.get(2);

            roomRepository.save(new Room(null, "301", 3, RoomStatus.AVAILABLE, single));
            roomRepository.save(new Room(null, "302", 3, RoomStatus.AVAILABLE, single));
            roomRepository.save(new Room(null, "303", 3, RoomStatus.AVAILABLE, double_));
            roomRepository.save(new Room(null, "401", 4, RoomStatus.AVAILABLE, double_));
            roomRepository.save(new Room(null, "402", 4, RoomStatus.AVAILABLE, double_));
            roomRepository.save(new Room(null, "403", 4, RoomStatus.AVAILABLE, suite));
            roomRepository.save(new Room(null, "404", 4, RoomStatus.AVAILABLE, suite));
            roomRepository.save(new Room(null, "501", 5, RoomStatus.AVAILABLE, single));
            roomRepository.save(new Room(null, "502", 5, RoomStatus.AVAILABLE, double_));
            roomRepository.save(new Room(null, "503", 5, RoomStatus.AVAILABLE, suite));
            log.info("创建10个示例房间");
        }
    }
}