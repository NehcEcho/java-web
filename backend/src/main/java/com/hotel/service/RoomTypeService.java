package com.hotel.service;

import com.hotel.dto.roomtype.RoomTypeRequest;
import com.hotel.dto.roomtype.RoomTypeResponse;
import com.hotel.entity.RoomType;
import com.hotel.exception.BusinessException;
import com.hotel.repository.RoomRepository;
import com.hotel.repository.RoomTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomTypeService {

    private final RoomTypeRepository roomTypeRepository;
    private final RoomRepository roomRepository;

    public List<RoomTypeResponse> findAll() {
        return roomTypeRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public RoomTypeResponse findById(Long id) {
        RoomType roomType = roomTypeRepository.findById(id)
                .orElseThrow(() -> new BusinessException("房间类型不存在"));
        return toResponse(roomType);
    }

    public RoomTypeResponse create(RoomTypeRequest request) {
        RoomType roomType = new RoomType();
        roomType.setName(request.getName());
        roomType.setBasePrice(request.getBasePrice());
        roomType.setMaxGuests(request.getMaxGuests());
        roomType.setDescription(request.getDescription());
        roomType.setAmenities(request.getAmenities());
        return toResponse(roomTypeRepository.save(roomType));
    }

    public RoomTypeResponse update(Long id, RoomTypeRequest request) {
        RoomType roomType = roomTypeRepository.findById(id)
                .orElseThrow(() -> new BusinessException("房间类型不存在"));
        roomType.setName(request.getName());
        roomType.setBasePrice(request.getBasePrice());
        roomType.setMaxGuests(request.getMaxGuests());
        roomType.setDescription(request.getDescription());
        roomType.setAmenities(request.getAmenities());
        return toResponse(roomTypeRepository.save(roomType));
    }

    public void delete(Long id) {
        RoomType roomType = roomTypeRepository.findById(id)
                .orElseThrow(() -> new BusinessException("房间类型不存在"));
        if (roomRepository.existsByRoomTypeId(id)) {
            throw new BusinessException("该房型下有房间，无法删除");
        }
        roomTypeRepository.deleteById(id);
    }

    private RoomTypeResponse toResponse(RoomType roomType) {
        RoomTypeResponse response = new RoomTypeResponse();
        response.setId(roomType.getId());
        response.setName(roomType.getName());
        response.setBasePrice(roomType.getBasePrice());
        response.setMaxGuests(roomType.getMaxGuests());
        response.setDescription(roomType.getDescription());
        response.setAmenities(roomType.getAmenities());
        return response;
    }
}