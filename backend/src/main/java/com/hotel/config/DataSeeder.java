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

            int roomId = 1;
            // Floors 3-7: 8 rooms each, mix of types
            for (int floor = 3; floor <= 7; floor++) {
                for (int r = 1; r <= 8; r++) {
                    String number = floor + String.format("%02d", r);
                    RoomType type;
                    if (r <= 3) type = single;
                    else if (r <= 6) type = double_;
                    else type = suite;
                    roomRepository.save(new Room(null, number, floor, RoomStatus.AVAILABLE, type));
                    roomId++;
                }
            }
            // Floor 8: 4 premium suites
            for (int r = 1; r <= 4; r++) {
                roomRepository.save(new Room(null, "80" + r, 8, RoomStatus.AVAILABLE, suite));
                roomId++;
            }
            log.info("创建44个示例房间 (3-8层)");
        }
    }
}